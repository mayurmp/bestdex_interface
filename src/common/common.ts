export default class Common {
  styles: string

  constructor() {
    this.styles = ''
  }

  /*
        Provide an array of margins and it will output the current styles
        string back that can be used directly in your className obj.
        This works on a similar basis to how margin is calculated in CSS in the
        order: [top, right, bottom, left], or if 2 values are provided; [top+bottom,
        left+right], or if 1 is provided then its used all around. :)
        Example:
            + [0, 1, 1, 0] - will provide 1 margin-right and 1 margin-bottom
            + [2, 0] - will provide 2 margin-top, 2 margin-bottom
            + [3] - will provide 3 margin all around.
    */
  static calculateMarginStyles = (marginArray: number[] | undefined): string => {
    let marginStyles = ''
    if (marginArray != null && marginArray.length > 0) {
      if (marginArray.length >= 4) {
        marginStyles = `
                    margin_top_${marginArray[0]}
                    margin_right_${marginArray[1]}
                    margin_bottom_${marginArray[2]}
                    margin_left_${marginArray[3]}
                `
      } else if (marginArray.length >= 2) {
        marginStyles = `
                    margin_top_${marginArray[0]}
                    margin_right_${marginArray[1]}
                    margin_bottom_${marginArray[0]}
                    margin_left_${marginArray[1]}
                `
      } else {
        marginStyles = `
                    margin_top_${marginArray[0]}
                    margin_right_${marginArray[0]}
                    margin_bottom_${marginArray[0]}
                    margin_left_${marginArray[0]}
                `
      }
    }
    return marginStyles
  }

  static numberWithCommas = (num: number) => {
    let res = num.toString()
    const pattern = /(-?\d+)(\d{3})/
    while (pattern.test(res)) res = res.replace(pattern, '$1,$2')
    return res
  }

  static asyncTimeout = async (interval: number): Promise<void> => {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, interval)
    })
  }

  static asyncSetState = async (component: React.PureComponent, obj: Record<string, unknown>): Promise<void> => {
    return await new Promise((resolve, reject) => {
      component.setState(obj, resolve)
    })
  }
}
