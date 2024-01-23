import fs from 'fs';
import prompts from 'prompts';
import { config } from 'dotenv';
import { resolve } from 'path';
(async () => {
  // define script variable to be runned
  let script: string | undefined = undefined;
  let lastPrompts: string[] = [];

  // try to load previous prompts
  try {
    const lastPrompt = await fs
      .readFileSync(resolve(__dirname, '.prompt'))
      .toString('utf8');
    lastPrompts = JSON.parse(lastPrompt || '[]') || [];
  } catch (error) {
    console.log('cannot load last prompts...');
  }

  // ask user to rerun previous scripts runned (to avoid re input script name)
  if (lastPrompts instanceof Array && lastPrompts.length > 0) {
    const rerunPrompt = await prompts({
      type: 'select',
      name: 'script',
      message: `You ran scripts before, do you want to re-run one of them?`,
      initial: 1,
      choices: [
        { title: 'No', value: 'no' },
        ...lastPrompts.map(scriptPath => ({
          title: scriptPath,
          value: scriptPath,
        })),
      ],
    });
    if (!rerunPrompt.script) process.exit(0);
    else if (rerunPrompt.script === 'no')
      console.log('Ok, lets add a new one...');
    else script = rerunPrompt.script;
  }

  // if previous script was not runned or user does not want to re-run it
  // then ask for a new script name
  if (!script) {
    const prompt = await prompts({
      type: 'text',
      name: 'script',
      message: 'Type the script path and name, does not need extension:',
    });
    // leave execution if migration not provided
    if (!prompt.script) process.exit(0);
    script = prompt.script;
  }

  // exit if script not defined
  if (!script) return [console.log('Script not defined'), process.exit(0)];

  // load environment variables
  console.log('loading environment variables...');
  config();

  const pathScript = resolve(__dirname, `${script}.ts`);

  // checking if script file exists
  if (!(await fs.existsSync(pathScript))) {
    console.log(`provided script (${pathScript}) path does not exists!!!`);
    process.exit(0);
  }

  // save script file on .prompt file to re-run on next execution
  lastPrompts.unshift(script);
  await fs.writeFileSync(
    resolve(__dirname, '.prompt'),
    JSON.stringify(
      Array.from(new Set(lastPrompts)).slice(0, 10), // remove duplicateds and keep the first 5
    ),
  );

  // run script
  console.log('run', pathScript);
  const { handler } = await import(pathScript);
  await handler();

  // exit
  console.log('done...');
  process.exit(0);
})();
