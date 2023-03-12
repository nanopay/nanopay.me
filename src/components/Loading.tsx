import { useEffect, useState } from 'react'

const spaceHeight = 25 // 25%

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function Loading() {
	return <div className="reverse-spinner w-20 h-20 sm:w-28 sm:h-28"></div>
}
