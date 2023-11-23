'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'

function randomInRange(min: number, max: number) {
	return Math.random() * (max - min) + min
}

const canvasStyles: any = {
	position: 'fixed',
	pointerEvents: 'none',
	width: '100%',
	height: '100%',
	top: 0,
	left: 0,
}

function getAnimationSettings(originXA: number, originXB: number) {
	return {
		startVelocity: 30,
		spread: 360,
		ticks: 60,
		zIndex: 0,
		particleCount: 150,
		origin: {
			x: randomInRange(originXA, originXB),
			y: Math.random() - 0.2,
		},
	}
}

interface FireworksProps {
	count?: number
}

export default function Fireworks({ count = 1 }: FireworksProps) {
	const refAnimationInstance = useRef<any>(null)

	const getInstance = useCallback((instance: any) => {
		refAnimationInstance.current = instance
	}, [])

	const nextTickAnimation = useCallback(() => {
		if (refAnimationInstance.current) {
			refAnimationInstance.current(getAnimationSettings(0.1, 0.3))
			refAnimationInstance.current(getAnimationSettings(0.7, 0.9))
		}
	}, [])

	const start = async () => {
		for (let i = 0; i < count; i++) {
			nextTickAnimation()
			await new Promise(resolve => setTimeout(resolve, 1000))
		}
	}

	useEffect(() => {
		start()
	}, [])

	return (
		<>
			<ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
		</>
	)
}
