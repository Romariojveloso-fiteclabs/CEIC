import fs from 'node:fs';
import ts from 'typescript';

const tsconfig = JSON.parse(fs.readFileSync(new URL('../tsconfig.json', import.meta.url), 'utf8')).compilerOptions;

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (specifier.endsWith('.js') && (specifier.startsWith('./') || specifier.startsWith('../'))) {
      const tsSpecifier = specifier.slice(0, -3) + '.ts';
      return await nextResolve(tsSpecifier, context);
    }
    throw err;
  }
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.ts') && !url.includes('/node_modules/')) {
    const source = fs.readFileSync(new URL(url), 'utf8');
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        ...tsconfig,
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2023,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
      fileName: new URL(url).pathname,
    });
    return {
      format: 'module',
      shortCircuit: true,
      source: outputText,
    };
  }
  return nextLoad(url, context);
}
