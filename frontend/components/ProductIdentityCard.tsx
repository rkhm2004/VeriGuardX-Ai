import { motion } from "framer-motion"
import { ProductInfo } from "@/lib/types"

interface ProductIdentityCardProps {
  productInfo: ProductInfo
  partId: string
}

export function ProductIdentityCard({ productInfo, partId }: ProductIdentityCardProps) {
  const isUnidentified = productInfo.name === "Unidentified SKU"
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`bg-gradient-to-br from-black to-gray-900 border rounded-xl p-6 shadow-2xl backdrop-blur-sm ${
        isUnidentified
          ? 'border-yellow-500/30 shadow-yellow-500/20'
          : 'border-cyan-500/30 shadow-cyan-500/20'
      }`}
    >
      <div className="flex items-center space-x-6">
        {/* Product Image */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex-shrink-0"
        >
          <img
            src={productInfo.image_url}
            alt={productInfo.name}
            className="w-24 h-24 object-cover rounded-lg border border-cyan-400/50 shadow-lg"
          />
        </motion.div>

        {/* Product Details */}
        <div className="flex-1 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h3 className="text-xl font-mono font-bold text-cyan-400 uppercase tracking-wide">
              {productInfo.name}
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">ID:</span>
              <span className="text-white font-mono text-sm">{partId}</span>
            </div>

            <p className="text-gray-300 font-sans text-sm leading-relaxed">
              {productInfo.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Cyberpunk Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 opacity-50 pointer-events-none" />
    </motion.div>
  )
}