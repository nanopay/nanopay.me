import { useEffect, useState } from 'react'

export interface ScreenObserver {
	width: number
	height: number
	isMobile: boolean
	isTablet: boolean
	isDesktop: boolean
}

export const useScreenObserver = (): ScreenObserver => {
	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(0)

	const handleWindowResize = () => {
		setWidth(window.innerWidth)
		setHeight(window.innerHeight)
	}

	useEffect(() => {
		handleWindowResize()
		window.addEventListener('resize', handleWindowResize)
		return () => {
			window.removeEventListener('resize', handleWindowResize)
		}
	}, [])

	return {
		width,
		height,
		isMobile: width <= 768,
		isTablet: width > 768 && width <= 1024,
		isDesktop: width > 1024,
	}
}
