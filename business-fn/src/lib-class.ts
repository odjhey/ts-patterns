type AnyFunction = (...args: any[]) => any

export class Procedure<
  TDeps extends Record<string, AnyFunction>,
  TInput,
  TOutput
> {
  private dependencies!: TDeps
  private execFunction!: (context: { input: TInput; deps: TDeps }) => TOutput
  private inputFunction!: (input: any) => TInput

  static deps<TDeps extends Record<string, AnyFunction>>() {
    return new Procedure<TDeps, any, any>()
  }

  deps(dependencies: TDeps): this {
    this.dependencies = dependencies
    return this
  }

  input<TNewInput extends TInput>(
    inputFunction: (input: any) => TNewInput
  ): Procedure<TDeps, TNewInput, TOutput> {
    const newProcedure = new Procedure<TDeps, TNewInput, TOutput>()
    newProcedure.dependencies = this.dependencies
    newProcedure.inputFunction = inputFunction
    newProcedure.execFunction = this.execFunction
    return newProcedure
  }

  fn(execFunction: (context: { input: TInput; deps: TDeps }) => TOutput): this {
    this.execFunction = execFunction
    return this
  }

  run(input: TInput): TOutput {
    if (!this.dependencies || !this.execFunction || !this.inputFunction) {
      throw new Error('Dependencies, input, or execution function not defined.')
    }
    const processedInput = this.inputFunction(input)
    return this.execFunction({ input: processedInput, deps: this.dependencies })
  }
}
