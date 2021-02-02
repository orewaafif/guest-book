/** Utils ts */

import { environment } from "src/environments/environment"

/**
 * Returns host url with '/' at the end
 * 
 * Eg: 'http://localhost:3000/'
 */
export const apiUrl = () => {
    const host = localStorage.getItem('_host') || environment.apiUrl

    return host
}

/**
 * Returns true when the childEle is in parentEle || viewport
 * @param childEle Element to be checked
 * @param parentEle Parent element in comparison
 */
export function eleIsIn(childEle, parentEle?, getDetails?: boolean):
    boolean | IEleIsIn {
    const viewPortRect: IRect = {
        top: 0,
        left: 0,
        bottom: (window.innerHeight || document.documentElement.clientHeight),
        right: (window.innerWidth || document.documentElement.clientWidth)
    }
    const parentRect: IRect = parentEle?.getBoundingClientRect()
    const childRect: IRect = childEle.getBoundingClientRect()
    const compareRect: IRect = {
        left: (parentRect?.left || viewPortRect.left),
        right: (parentRect?.right || viewPortRect.right),
        top: (parentRect?.top || viewPortRect.top),
        bottom: (parentRect?.bottom || viewPortRect.bottom)
    }

    const isIn = childRect.top >= compareRect.top &&
        childRect.left >= compareRect.left &&
        childRect.right <= compareRect.right &&
        childRect.bottom <= compareRect.bottom

    if (!getDetails)
        return isIn

    /**
        left = max(r1.left, r2.left)
        right = min(r1.right, r2.right)
        bottom = min(r1.bottom, r2.bottom)
        top = max(r1.top, r2.top)
     */
    const intersectRect = {
        left: Math.max(childRect.left, compareRect.left),
        top: Math.max(childRect.top, compareRect.top),
        right: Math.min(childRect.right, compareRect.right),
        bottom: Math.min(childRect.bottom, compareRect.bottom)
    }
    const isIntersect = (intersectRect.left < intersectRect.right && intersectRect.top < intersectRect.bottom)
    const childA = (childRect.right - childRect.left) * (childRect.bottom - childRect.top)
    const compareA = (compareRect.right - compareRect.left) * (compareRect.bottom - compareRect.top)

    const intersectA = isIntersect ? ((intersectRect.right - intersectRect.left) * (intersectRect.bottom - intersectRect.top)) : null

    const details = {
        isIn: isIn,
        intersect: isIntersect,
        intersectRect,
        childRect,
        compareRect,
        intersectArea: intersectA,
        intersectPercent: intersectA / childA * 100
    }

    return details
}

export interface IRect {
    //left, top, right, bottom, x, y, width, and height
    left?: number
    top?: number
    right?: number
    bottom?: number
    x?: number
    y?: number
    width?: number
    heigth?: number
}

export interface IEleIsIn {
    isIn: boolean,
    intersect: boolean,
    intersectRect: IRect,
    childRect: IRect,
    compareRect: IRect,
    intersectArea: number,
    intersectPercent: number
}