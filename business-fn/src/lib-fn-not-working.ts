type AnyFunction = (...args: any[]) => any

interface ProcedureContext<
  TDeps extends Record<string, AnyFunction>,
  TInput,
  TOutput
> {
  deps: TDeps
  inputFunction: (input: any) => TInput
  execFunction: (context: { input: TInput; deps: TDeps }) => TOutput
}

export const createProcedure = () => {
  let dependenciesType: any
  let inputFunction: ((input: any) => any) | undefined
  let execFunction: ((context: { input: any; deps: any }) => any) | undefined

  const setDepsType = <TDeps extends Record<string, AnyFunction>>() => {
    dependenciesType = {} as TDeps
    return {
      input: setInput<TDeps>,
    }
  }

  const setInput = <TDeps>(inputFn: (input: any) => any) => {
    inputFunction = inputFn
    return {
      fn: setExecFunction<TDeps>,
    }
  }

  const setExecFunction = <TDeps, TInput, TOutput>(
    execFn: (context: { input: TInput; deps: TDeps }) => TOutput
  ) => {
    execFunction = execFn
    return {
      run: runProcedure<TDeps, TInput, TOutput>,
    }
  }

  const runProcedure = <TDeps, TInput, TOutput>(deps: TDeps) => {
    return (input: any): TOutput => {
      if (!inputFunction || !execFunction) {
        throw new Error('Input function or execution function not defined.')
      }
      const processedInput = inputFunction!(input)
      return execFunction!({ input: processedInput, deps })
    }
  }

  return {
    deps: setDepsType,
  }
}
