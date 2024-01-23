import { PaginationProps } from './dto';
import { PaginationType } from './types';
import { Collection, Document, ObjectId } from 'mongodb';
import { ParserUtil } from '@domain/utils/parser';

export class PaginationFactory<T> {
  constructor(private readonly params: PaginationProps) {}

  private shouldPaginateOffset(): boolean {
    return (!!this.params.page || !!this.params.limit) && !this.params.cursor;
  }

  private shouldPaginateCursor(): boolean {
    return !!this.params.cursor && !this.params.page;
  }

  private buildFieldProjection(): Document[] {
    if (!this.params.fields) {
      // return all fields if selection fields not provided
      return [
        { $addFields: { id: { $toString: '$_id' } } },
        {
          $project: {
            _id: false,
            ...Object.fromEntries(
              new Set(
                (this.params.allowedFields || []).map(field => [field, true]),
              ),
            ),
          },
        },
      ];
    } else {
      // return selected fields if provided
      return [
        {
          $project: {
            _id: false,
            id: true,
            ...Object.fromEntries(
              new Set(
                (this.params.allowedFields || [])
                  .filter(field => (this.params.fields || []).includes(field))
                  .map(field => [field, true]),
              ),
            ),
          },
        },
      ];
    }
  }

  private buildPaginationOffsetDocument(): Document[] {
    if (!this.shouldPaginateOffset()) return [];
    const page = ParserUtil.parseInt(this.params.page, 1);
    const limit = ParserUtil.parseInt(this.params.limit, 10);
    return [
      {
        $facet: {
          paginatedResults: [
            { $limit: (page - 1) * limit + limit },
            { $skip: (page - 1) * limit },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ];
  }

  private buildPaginationCursorDocument(): Document[] {
    if (!this.shouldPaginateCursor()) return [];
    const sort = this.params.sortCursor || 'asc';
    const limit = ParserUtil.parseInt(this.params.limit, 10);
    const pipe: Document[] = [];
    if (new RegExp('^[0-9a-fA-F]{24}$').test(this.params.cursor || 'nill')) {
      pipe.push({
        $match: {
          _id: {
            [sort === 'asc' ? '$gt' : '$lt']: new ObjectId(this.params.cursor),
          },
        },
      });
    }
    pipe.push({ $sort: { _id: sort === 'asc' ? 1 : -1 } });
    pipe.push({ $limit: limit });

    // <!-- Attention - Keep the right sequence! -->
    // <!-- Changing the order gets unexpected results -->
    // <!-- 1 - match; 2 - sort; 3 - limit -->

    return pipe;
  }

  public async execute(
    collection: Collection<Document>,
    pipeline: Document[],
  ): Promise<T[] | PaginationType<T>> {
    const results = await collection
      .aggregate([
        { $addFields: { id: { $toString: '$_id' } } },
        // pipeline runs always before to match user needs
        ...pipeline,
        // cursor paged runs before field projection because it uses default _id propoerty
        ...this.buildPaginationCursorDocument(),
        // build field projection runs after paginated cursor, because it removes _id property
        ...this.buildFieldProjection(),
        // pagination offset runs always on the end
        ...this.buildPaginationOffsetDocument(),
      ])
      .toArray();

    if (!this.shouldPaginateOffset()) {
      return results as T[];
    } else {
      const total = results?.[0]?.totalCount?.[0]?.count || 0;
      const page = ParserUtil.parseInt(this.params.page, 1);
      const limit = ParserUtil.parseInt(this.params.limit, 10);
      return {
        pagination: {
          limit: limit,
          page: page,
          pages: Math.ceil(total / limit),
          total: total,
        },
        results: results?.[0]?.paginatedResults || [],
      };
    }
  }
}
