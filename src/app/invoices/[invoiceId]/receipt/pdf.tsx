'use client'

import dynamic from 'next/dynamic'

const PDFViewer = dynamic(
	() => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
	{
		ssr: false,
		loading: () => <p>Loading...</p>,
	},
)

import React from 'react'
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Link,
	Font,
	Svg,
	Path,
	SVGProps,
} from '@react-pdf/renderer'

import { InvoicePublic } from '@/core/client'
import { SITE_URL } from '@/core/constants'
import { formatDate } from '@/utils/others'

export default function InvoiceReceiptPdf({
	invoice,
}: {
	invoice: InvoicePublic
}) {
	Font.register({
		family: 'OpenSans',
		fonts: [
			{ src: '/fonts/OpenSans-Regular.ttf' },
			{ src: '/fonts/OpenSans-SemiBold.ttf', fontWeight: 600 },
			{ src: '/fonts/OpenSans-Bold.ttf', fontWeight: 700 },
		],
	})

	const styles = StyleSheet.create({
		page: {
			fontFamily: 'OpenSans',
			padding: 40,
			backgroundColor: '#ffffff',
		},
		header: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			padding: 20,
		},
		headerTitle: {
			color: '#334155',
			fontSize: 35,
			fontWeight: 'bold',
		},
		headerDescription: {
			color: '#333',
			fontSize: 20,
			fontWeight: 'semibold',
		},
		section: {
			padding: 20,
			borderBottom: '1 solid #ccc',
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: 'semibold',
			marginBottom: 5,
		},
		flexRow: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		avatar: {
			marginRight: 10,
		},
		link: {
			color: '#209CE9',
			textDecoration: 'underline',
		},
		amountPaid: {
			fontSize: 24,
			fontWeight: 'bold',
			color: '#334155',
		},
		transactionHash: {
			fontSize: 12,
			color: '#64748b',
			wordBreak: 'break-all',
		},
		footer: {
			borderTop: '1 solid #e2e8f0',
			padding: 20,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		footerText: {
			color: '#475569',
			fontSize: 8,
		},
		footerLogo: {
			width: 120,
			height: 'auto',
		},
		viewer: {
			width: '100%',
			height: '100vh',
		},
	})

	return (
		<PDFViewer style={styles.viewer}>
			<Document>
				<Page size="A4" style={styles.page}>
					<View style={styles.header}>
						<View>
							<Text style={styles.headerTitle}>Payment Receipt</Text>
							<Text style={styles.headerDescription}>
								Invoice: {invoice.id}
							</Text>
						</View>
						<View
							style={{
								width: 80,
								height: 80,
								backgroundColor: '#334155',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								borderRadius: 40,
							}}
						>
							<NanoPayLogomarkForPdf
								theme="dark"
								style={{
									width: 60,
									height: 60,
								}}
							/>
						</View>
					</View>

					<View style={styles.section}>
						<View>
							<Text style={styles.sectionTitle}>{invoice.service.name}</Text>
							{invoice.service.website && (
								<Link
									style={{
										...styles.link,
										fontSize: 12,
									}}
									src={invoice.service.website}
								>
									{invoice.service.website}
								</Link>
							)}
							<Text>{invoice.service.contact_email}</Text>
						</View>
					</View>

					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Invoice:</Text>
						<View style={{ marginLeft: 20 }}>
							<Text
								style={{
									fontSize: 16,
									fontWeight: 'bold',
								}}
							>
								{invoice.title}
							</Text>
							<Text
								style={{
									fontSize: 12,
									color: '#555',
								}}
							>
								{invoice.description}
							</Text>
						</View>
					</View>

					<View style={styles.section}>
						<View style={styles.flexRow}>
							<View>
								<Text style={styles.sectionTitle}>Amount Paid</Text>
								<View style={{ marginLeft: 20 }}>
									<Text style={styles.amountPaid}>Ӿ 0.05</Text>
								</View>
							</View>
							<View>
								<Text style={[styles.sectionTitle, { marginTop: 10 }]}>
									Payment Date
								</Text>
								<Text>{formatDate(invoice.created_at)}</Text>
							</View>
						</View>
					</View>

					<View style={styles.section}>
						<Text style={[styles.sectionTitle, { marginTop: 10 }]}>
							Transaction(s)
						</Text>
						{invoice.payments.map((payment, index) => (
							<>
								<Text key={index} style={styles.transactionHash}>
									Block: {payment.hash}
								</Text>
								<Text key={index} style={styles.transactionHash}>
									From: {payment.from}
								</Text>
							</>
						))}
					</View>

					<View style={styles.footer}>
						<View>
							<Text style={styles.footerText}>Powered by</Text>
							<NanoPayLogoForPdf theme="light" style={styles.footerLogo} />
						</View>
						<Link src={SITE_URL} style={styles.link}>
							{SITE_URL}
						</Link>
					</View>
				</Page>
			</Document>
		</PDFViewer>
	)
}

function NanoPayLogomarkForPdf({
	theme = 'light',
	...props
}: SVGProps & {
	theme: 'light' | 'dark'
}) {
	const color = theme === 'light' ? '#334155' : '#fff'
	return (
		<Svg width="40" height="32" viewBox="0 0 259 196" fill="none" {...props}>
			<Path
				d="M149.281 94L156.269 98.7344L168 116H25.9836C20.4698 116 16 111.075 16 105C16 98.9247 20.4698 94 25.9836 94H108.348H140.545H149.281Z"
				fill="#209CE9"
				stroke="#209CE9"
			/>
			<Path
				d="M94.9668 93L21 1H49.4872L126.703 93H94.9668Z"
				fill={color}
				stroke={color}
			/>
			<Path
				d="M80.7169 93L7 1H35.4872L112.703 93H80.7169Z"
				fill={color}
				stroke={color}
			/>
			<Path
				d="M140.687 89.285V91.9805C140.687 93.0843 140.856 94.1845 141.192 95.2605L142.061 98.0467L142.749 100.249C143.204 101.708 143.97 103.106 145.02 104.389L217.403 192.939L243.391 192.855L169.809 98.967C168.567 97.3925 167.797 95.6419 167.551 93.8317C167.467 93.2161 167.444 92.5972 167.482 91.9794L167.675 88.8694L167.686 88.691C167.842 86.161 168.887 83.7037 170.719 81.5581L238.893 1.68549H215.403L144.009 81.1506C142.802 82.4942 141.904 83.9743 141.351 85.5318L141.334 85.5784C140.904 86.7884 140.687 88.0339 140.687 89.285Z"
				fill={color}
				stroke={color}
			/>
			<Path
				d="M154.931 88.9743V91.6699C154.931 92.7737 155.1 93.8739 155.436 94.9498L156.305 97.736L156.992 99.9386C157.448 101.398 158.214 102.795 159.263 104.078L231.646 192.855H257L183.168 99.2499C181.926 97.6754 182.041 95.3312 181.795 93.5211C181.711 92.9055 181.688 92.2866 181.726 91.6688L181.919 88.5588L181.93 88.3804C182.086 85.8504 183.131 83.3931 184.962 81.2475L253.137 1.37488H229.647L158.253 80.84C157.046 82.1835 156.148 83.6636 155.594 85.2212L155.578 85.2678C155.148 86.4778 154.931 87.7233 154.931 88.9743Z"
				fill={color}
				stroke={color}
			/>
			<Path
				d="M47.759 149.051L222.833 149.5L206.055 128.5L47.7907 127.5C41.882 127.483 37.0827 132.312 37.0827 138.276C37.0827 144.227 41.8626 149.051 47.759 149.051Z"
				fill="#209CE9"
				stroke="#209CE9"
			/>
			<Path
				d="M13.4946 194.625L57.9746 150H86.4619L44.4807 194.625H13.4946Z"
				fill={color}
				stroke={color}
			/>
			<Path
				d="M2 194.625L46.48 150H74.9672L32.9861 194.625H2Z"
				fill={color}
				stroke={color}
			/>
		</Svg>
	)
}

export function NanoPayLogoForPdf({
	theme = 'light',
	...props
}: SVGProps & {
	theme: 'light' | 'dark'
}) {
	const color = theme === 'light' ? '#334155' : '#fff'

	return (
		<Svg width="303" height="68" viewBox="0 0 1213 273" fill="none" {...props}>
			<Path
				d="M299.6 203.4C296.8 203.4 294.6 202.6 293 201C291.4 199.4 290.6 197.067 290.6 194V112.4C290.6 109.333 291.4 107.067 293 105.6C294.6 104 296.8 103.2 299.6 103.2C302.4 103.2 304.533 104 306 105.6C307.6 107.067 308.4 109.333 308.4 112.4V128.8L306.2 125.8C309 118.2 313.533 112.467 319.8 108.6C326.2 104.733 333.467 102.8 341.6 102.8C349.467 102.8 355.933 104.2 361 107C366.067 109.8 369.867 114.067 372.4 119.8C374.933 125.533 376.2 132.8 376.2 141.6V194C376.2 197.067 375.4 199.4 373.8 201C372.333 202.6 370.133 203.4 367.2 203.4C364.267 203.4 362 202.6 360.4 201C358.8 199.4 358 197.067 358 194V142.6C358 133.933 356.333 127.6 353 123.6C349.667 119.6 344.333 117.6 337 117.6C328.467 117.6 321.6 120.267 316.4 125.6C311.333 130.8 308.8 137.867 308.8 146.8V194C308.8 200.267 305.733 203.4 299.6 203.4ZM436.053 203.8C429.386 203.8 423.32 202.467 417.853 199.8C412.52 197.133 408.32 193.533 405.253 189C402.32 184.467 400.853 179.4 400.853 173.8C400.853 166.6 402.653 160.933 406.253 156.8C409.853 152.667 415.92 149.733 424.453 148C432.986 146.133 444.453 145.2 458.853 145.2H468.253V156.8H459.253C448.986 156.8 440.853 157.267 434.853 158.2C428.986 159.133 424.853 160.8 422.453 163.2C420.053 165.467 418.853 168.667 418.853 172.8C418.853 178 420.653 182.267 424.253 185.6C427.986 188.933 433.053 190.6 439.453 190.6C444.52 190.6 448.986 189.4 452.853 187C456.72 184.467 459.786 181.133 462.053 177C464.32 172.733 465.453 167.867 465.453 162.4V139.4C465.453 131.533 463.853 125.867 460.653 122.4C457.453 118.8 452.053 117 444.453 117C440.053 117 435.52 117.6 430.853 118.8C426.186 120 421.32 121.867 416.253 124.4C414.253 125.333 412.52 125.667 411.053 125.4C409.586 125 408.386 124.2 407.453 123C406.653 121.667 406.186 120.267 406.053 118.8C406.053 117.2 406.386 115.667 407.053 114.2C407.853 112.733 409.186 111.667 411.053 111C416.92 108.067 422.72 106 428.453 104.8C434.32 103.467 439.786 102.8 444.853 102.8C453.52 102.8 460.653 104.2 466.253 107C471.853 109.667 476.053 113.867 478.853 119.6C481.653 125.2 483.053 132.4 483.053 141.2V194C483.053 197.067 482.32 199.4 480.853 201C479.386 202.6 477.253 203.4 474.453 203.4C471.786 203.4 469.653 202.6 468.053 201C466.586 199.4 465.853 197.067 465.853 194V179.8H467.653C466.586 184.733 464.586 189 461.653 192.6C458.72 196.2 455.053 199 450.653 201C446.386 202.867 441.52 203.8 436.053 203.8ZM520.694 203.4C517.894 203.4 515.694 202.6 514.094 201C512.494 199.4 511.694 197.067 511.694 194V112.4C511.694 109.333 512.494 107.067 514.094 105.6C515.694 104 517.894 103.2 520.694 103.2C523.494 103.2 525.627 104 527.094 105.6C528.694 107.067 529.494 109.333 529.494 112.4V128.8L527.294 125.8C530.094 118.2 534.627 112.467 540.894 108.6C547.294 104.733 554.56 102.8 562.694 102.8C570.56 102.8 577.027 104.2 582.094 107C587.16 109.8 590.96 114.067 593.494 119.8C596.027 125.533 597.294 132.8 597.294 141.6V194C597.294 197.067 596.494 199.4 594.894 201C593.427 202.6 591.227 203.4 588.294 203.4C585.36 203.4 583.094 202.6 581.494 201C579.894 199.4 579.094 197.067 579.094 194V142.6C579.094 133.933 577.427 127.6 574.094 123.6C570.76 119.6 565.427 117.6 558.094 117.6C549.56 117.6 542.694 120.267 537.494 125.6C532.427 130.8 529.894 137.867 529.894 146.8V194C529.894 200.267 526.827 203.4 520.694 203.4ZM667.547 203.8C657.947 203.8 649.614 201.733 642.547 197.6C635.48 193.467 630.014 187.6 626.147 180C622.28 172.4 620.347 163.467 620.347 153.2C620.347 145.467 621.414 138.533 623.547 132.4C625.814 126.133 629.014 120.8 633.147 116.4C637.28 112 642.214 108.667 647.947 106.4C653.814 104 660.347 102.8 667.547 102.8C677.147 102.8 685.48 104.867 692.547 109C699.614 113.133 705.08 119 708.947 126.6C712.814 134.067 714.747 142.933 714.747 153.2C714.747 160.933 713.614 167.933 711.347 174.2C709.214 180.467 706.08 185.8 701.947 190.2C697.814 194.6 692.814 198 686.947 200.4C681.214 202.667 674.747 203.8 667.547 203.8ZM667.547 189.4C673.414 189.4 678.48 188 682.747 185.2C687.147 182.4 690.48 178.333 692.747 173C695.147 167.667 696.347 161.067 696.347 153.2C696.347 141.467 693.747 132.533 688.547 126.4C683.347 120.267 676.347 117.2 667.547 117.2C661.814 117.2 656.747 118.6 652.347 121.4C648.08 124.067 644.747 128.067 642.347 133.4C639.947 138.733 638.747 145.333 638.747 153.2C638.747 164.933 641.347 173.933 646.547 180.2C651.88 186.333 658.88 189.4 667.547 189.4Z"
				fill="#209CE9"
			/>
			<Path
				d="M747.061 239.4C744.261 239.4 742.061 238.6 740.461 237C738.861 235.4 738.061 233.133 738.061 230.2V112.4C738.061 109.333 738.861 107.067 740.461 105.6C742.061 104 744.261 103.2 747.061 103.2C749.994 103.2 752.194 104 753.661 105.6C755.261 107.067 756.061 109.333 756.061 112.4V130.6L753.861 127C755.994 119.667 760.194 113.8 766.461 109.4C772.728 105 780.261 102.8 789.061 102.8C797.728 102.8 805.261 104.867 811.661 109C818.061 113 823.061 118.8 826.661 126.4C830.261 133.867 832.061 142.8 832.061 153.2C832.061 163.467 830.261 172.467 826.661 180.2C823.194 187.8 818.194 193.667 811.661 197.8C805.261 201.8 797.728 203.8 789.061 203.8C780.394 203.8 772.928 201.6 766.661 197.2C760.394 192.8 756.194 187 754.061 179.8H756.261V230.2C756.261 233.133 755.461 235.4 753.861 237C752.261 238.6 749.994 239.4 747.061 239.4ZM784.861 189.4C790.594 189.4 795.594 188 799.861 185.2C804.261 182.4 807.661 178.333 810.061 173C812.461 167.667 813.661 161.067 813.661 153.2C813.661 141.467 811.061 132.533 805.861 126.4C800.661 120.267 793.661 117.2 784.861 117.2C778.994 117.2 773.861 118.6 769.461 121.4C765.194 124.067 761.861 128.067 759.461 133.4C757.194 138.733 756.061 145.333 756.061 153.2C756.061 164.933 758.661 173.933 763.861 180.2C769.061 186.333 776.061 189.4 784.861 189.4ZM886.444 203.8C879.777 203.8 873.71 202.467 868.244 199.8C862.91 197.133 858.71 193.533 855.644 189C852.71 184.467 851.244 179.4 851.244 173.8C851.244 166.6 853.044 160.933 856.644 156.8C860.244 152.667 866.31 149.733 874.844 148C883.377 146.133 894.844 145.2 909.244 145.2H918.644V156.8H909.644C899.377 156.8 891.244 157.267 885.244 158.2C879.377 159.133 875.244 160.8 872.844 163.2C870.444 165.467 869.244 168.667 869.244 172.8C869.244 178 871.044 182.267 874.644 185.6C878.377 188.933 883.444 190.6 889.844 190.6C894.91 190.6 899.377 189.4 903.244 187C907.11 184.467 910.177 181.133 912.444 177C914.71 172.733 915.844 167.867 915.844 162.4V139.4C915.844 131.533 914.244 125.867 911.044 122.4C907.844 118.8 902.444 117 894.844 117C890.444 117 885.91 117.6 881.244 118.8C876.577 120 871.71 121.867 866.644 124.4C864.644 125.333 862.91 125.667 861.444 125.4C859.977 125 858.777 124.2 857.844 123C857.044 121.667 856.577 120.267 856.444 118.8C856.444 117.2 856.777 115.667 857.444 114.2C858.244 112.733 859.577 111.667 861.444 111C867.31 108.067 873.11 106 878.844 104.8C884.71 103.467 890.177 102.8 895.244 102.8C903.91 102.8 911.044 104.2 916.644 107C922.244 109.667 926.444 113.867 929.244 119.6C932.044 125.2 933.444 132.4 933.444 141.2V194C933.444 197.067 932.71 199.4 931.244 201C929.777 202.6 927.644 203.4 924.844 203.4C922.177 203.4 920.044 202.6 918.444 201C916.977 199.4 916.244 197.067 916.244 194V179.8H918.044C916.977 184.733 914.977 189 912.044 192.6C909.11 196.2 905.444 199 901.044 201C896.777 202.867 891.91 203.8 886.444 203.8ZM983.508 239.4C981.374 239.4 979.574 238.8 978.108 237.6C976.774 236.533 975.974 235 975.708 233C975.574 231.133 975.974 229.133 976.908 227L990.508 196.2V203.8L952.708 115.8C951.774 113.533 951.441 111.467 951.708 109.6C951.974 107.733 952.841 106.2 954.308 105C955.908 103.8 958.041 103.2 960.708 103.2C962.974 103.2 964.774 103.733 966.108 104.8C967.441 105.867 968.708 107.733 969.908 110.4L1001.31 187.8H995.708L1027.71 110.4C1028.77 107.733 1030.04 105.867 1031.51 104.8C1032.97 103.733 1034.97 103.2 1037.51 103.2C1039.77 103.2 1041.51 103.8 1042.71 105C1044.04 106.2 1044.84 107.733 1045.11 109.6C1045.37 111.467 1044.97 113.467 1043.91 115.6L993.508 232.2C992.174 235 990.774 236.867 989.308 237.8C987.974 238.867 986.041 239.4 983.508 239.4ZM1061.53 202.4C1059.79 202.4 1058.36 201.833 1057.23 200.7C1056.09 199.567 1055.53 198.133 1055.53 196.4C1055.53 194.667 1056.09 193.267 1057.23 192.2C1058.36 191.133 1059.79 190.6 1061.53 190.6C1063.39 190.6 1064.83 191.133 1065.83 192.2C1066.89 193.267 1067.43 194.667 1067.43 196.4C1067.43 198.133 1066.89 199.567 1065.83 200.7C1064.83 201.833 1063.39 202.4 1061.53 202.4ZM1085.17 202.7C1083.77 202.7 1082.67 202.3 1081.87 201.5C1081.07 200.7 1080.67 199.533 1080.67 198V157.2C1080.67 155.667 1081.07 154.533 1081.87 153.8C1082.67 153 1083.77 152.6 1085.17 152.6C1086.57 152.6 1087.63 153 1088.37 153.8C1089.17 154.533 1089.57 155.667 1089.57 157.2V165.7L1088.47 163.9C1089.73 160.233 1091.77 157.4 1094.57 155.4C1097.43 153.4 1100.83 152.4 1104.77 152.4C1108.9 152.4 1112.23 153.4 1114.77 155.4C1117.3 157.333 1119 160.3 1119.87 164.3H1118.47C1119.67 160.633 1121.8 157.733 1124.87 155.6C1128 153.467 1131.63 152.4 1135.77 152.4C1139.43 152.4 1142.43 153.133 1144.77 154.6C1147.17 156 1148.97 158.133 1150.17 161C1151.37 163.8 1151.97 167.4 1151.97 171.8V198C1151.97 199.533 1151.57 200.7 1150.77 201.5C1149.97 202.3 1148.87 202.7 1147.47 202.7C1146 202.7 1144.87 202.3 1144.07 201.5C1143.27 200.7 1142.87 199.533 1142.87 198V172.2C1142.87 167.933 1142.13 164.8 1140.67 162.8C1139.2 160.8 1136.73 159.8 1133.27 159.8C1129.47 159.8 1126.43 161.133 1124.17 163.8C1121.97 166.4 1120.87 170 1120.87 174.6V198C1120.87 199.533 1120.47 200.7 1119.67 201.5C1118.93 202.3 1117.83 202.7 1116.37 202.7C1114.9 202.7 1113.77 202.3 1112.97 201.5C1112.17 200.7 1111.77 199.533 1111.77 198V172.2C1111.77 167.933 1111.03 164.8 1109.57 162.8C1108.1 160.8 1105.63 159.8 1102.17 159.8C1098.37 159.8 1095.33 161.133 1093.07 163.8C1090.87 166.4 1089.77 170 1089.77 174.6V198C1089.77 201.133 1088.23 202.7 1085.17 202.7ZM1189.1 202.9C1183.83 202.9 1179.3 201.9 1175.5 199.9C1171.77 197.833 1168.87 194.933 1166.8 191.2C1164.73 187.4 1163.7 182.933 1163.7 177.8C1163.7 172.733 1164.7 168.3 1166.7 164.5C1168.77 160.7 1171.57 157.733 1175.1 155.6C1178.7 153.467 1182.8 152.4 1187.4 152.4C1190.67 152.4 1193.6 152.967 1196.2 154.1C1198.87 155.167 1201.13 156.733 1203 158.8C1204.87 160.867 1206.27 163.4 1207.2 166.4C1208.2 169.333 1208.7 172.667 1208.7 176.4C1208.7 177.467 1208.37 178.3 1207.7 178.9C1207.1 179.433 1206.2 179.7 1205 179.7H1170.8V173.9H1202.7L1201 175.3C1201 171.833 1200.47 168.9 1199.4 166.5C1198.4 164.033 1196.9 162.167 1194.9 160.9C1192.97 159.633 1190.53 159 1187.6 159C1184.4 159 1181.67 159.767 1179.4 161.3C1177.13 162.767 1175.4 164.867 1174.2 167.6C1173 170.267 1172.4 173.367 1172.4 176.9V177.5C1172.4 183.5 1173.83 188.033 1176.7 191.1C1179.57 194.167 1183.7 195.7 1189.1 195.7C1191.23 195.7 1193.4 195.433 1195.6 194.9C1197.87 194.367 1200.03 193.4 1202.1 192C1203.1 191.4 1204 191.133 1204.8 191.2C1205.67 191.2 1206.37 191.467 1206.9 192C1207.43 192.467 1207.77 193.067 1207.9 193.8C1208.03 194.467 1207.93 195.2 1207.6 196C1207.27 196.8 1206.63 197.5 1205.7 198.1C1203.5 199.633 1200.87 200.833 1197.8 201.7C1194.8 202.5 1191.9 202.9 1189.1 202.9Z"
				fill={color}
			/>
			<Path
				d="M149.281 146L156.269 150.734L168 168H25.9836C20.4698 168 16 163.075 16 157C16 150.925 20.4698 146 25.9836 146H108.348H140.545H149.281Z"
				fill="#209CE9"
				stroke="#209CE9"
			/>
			<Path
				d="M94.9668 145L21 53H49.4872L126.703 145H94.9668Z"
				fill={color}
				stroke={color}
			/>
			<Path
				d="M80.7169 145L7 53H35.4872L112.703 145H80.7169Z"
				fill={color}
				stroke={color}
			/>
			<Path
				d="M140.687 141.285V143.98C140.687 145.084 140.856 146.185 141.192 147.26L142.061 150.047L142.749 152.249C143.204 153.708 143.97 155.106 145.02 156.389L217.403 244.939L243.391 244.855L169.809 150.967C168.567 149.393 167.797 147.642 167.551 145.832C167.467 145.216 167.444 144.597 167.482 143.979L167.675 140.869L167.686 140.691C167.842 138.161 168.887 135.704 170.719 133.558L238.893 53.6855H215.403L144.009 133.151C142.802 134.494 141.904 135.974 141.351 137.532L141.334 137.578C140.904 138.788 140.687 140.034 140.687 141.285Z"
				fill={color}
				stroke={color}
			/>
			<Path
				d="M154.931 140.974V143.67C154.931 144.774 155.1 145.874 155.436 146.95L156.305 149.736L156.992 151.939C157.448 153.398 158.214 154.795 159.263 156.078L231.646 244.855H257L183.168 151.25C181.926 149.675 182.041 147.331 181.795 145.521C181.711 144.906 181.688 144.287 181.726 143.669L181.919 140.559L181.93 140.38C182.086 137.85 183.131 135.393 184.962 133.247L253.137 53.3749H229.647L158.253 132.84C157.046 134.184 156.148 135.664 155.594 137.221L155.578 137.268C155.148 138.478 154.931 139.723 154.931 140.974Z"
				fill={color}
				stroke={color}
			/>
			<Path
				d="M47.759 201.051L222.833 201.5L206.055 180.5L47.7907 179.5C41.882 179.483 37.0827 184.312 37.0827 190.276C37.0827 196.227 41.8626 201.051 47.759 201.051Z"
				fill="#209CE9"
				stroke="#209CE9"
			/>
			<Path
				d="M13.4946 246.625L57.9746 202H86.4619L44.4807 246.625H13.4946Z"
				fill={color}
				stroke={color}
			/>
			<Path
				d="M2 246.625L46.48 202H74.9672L32.9861 246.625H2Z"
				fill={color}
				stroke={color}
			/>
		</Svg>
	)
}