import React, { useEffect, useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Info, HelpCircle, Network, Search, Award } from 'lucide-react'
import { cn } from '@/utils/cn'
import { appService } from '@/services/api'

export const Knowledge = () => {
  const [graph, setGraph] = useState({ nodes: [], links: [] })
  const [selectedNode, setSelectedNode] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    appService.getKnowledgeGraph().then((response) => {
      if (response?.graph?.nodes) {
        setGraph(response.graph)
        if (response.graph.nodes.length > 0) {
          setSelectedNode(response.graph.nodes[0])
        }
      }
    }).catch(() => {})
  }, [])

  // Filter nodes for search highlight
  const highlightedNodeIds = graph.nodes
    .filter((n) => searchQuery && n.label.toLowerCase().includes(searchQuery.toLowerCase()))
    .map((n) => n.id)

  const groupColors = {
    0: 'fill-luxury-gold stroke-luxury-gold/30',      // root
    1: 'fill-luxury-emerald stroke-luxury-emerald/30', // Real Estate
    2: 'fill-luxury-blue stroke-luxury-blue/30',       // Auto
    3: 'fill-amber-400 stroke-amber-400/30',           // Luxury Watches
    4: 'fill-purple-400 stroke-purple-400/30'          // Gold
  }

  const groupLineColors = {
    0: 'stroke-luxury-gold/40',
    1: 'stroke-luxury-emerald/40',
    2: 'stroke-luxury-blue/40',
    3: 'stroke-amber-400/40',
    4: 'stroke-purple-400/40'
  }

  return (
    <div className="flex flex-col gap-6 select-none text-left">
      {/* Knowledge Graph Header */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4" hoverEffect={false}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-luxury-emerald/10 text-luxury-emerald border border-luxury-emerald/25 flex items-center justify-center">
            <Network size={20} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wide font-outfit">Asset Knowledge Graph</h2>
            <p className="text-[10px] text-text-muted">Explore connection nodes mapping tangible properties, inflation hedges, and cap rates.</p>
          </div>
        </div>

        {/* Filter input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-text-muted" size={13} />
          <input
            type="text"
            placeholder="Search node..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-surface-elevated/45 text-xs text-text-primary px-3 py-1.5 pl-8 rounded-xl border border-border focus:border-luxury-emerald/30 outline-none w-48"
          />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Interactive SVG Render Canvas */}
        <GlassCard className="lg:col-span-3 p-0 h-[450px] overflow-hidden flex items-center justify-center relative bg-[#06080d]/65 border border-border" hoverEffect={false}>
          {/* Zoom Instruction tip */}
          <div className="absolute top-4 left-4 text-[10px] text-text-muted flex items-center gap-1.5 select-none bg-surface/50 p-2 rounded-lg border border-border backdrop-blur-sm z-10">
            <HelpCircle size={12} /> Click nodes to inspect variables.
          </div>

          <svg className="w-full h-full cursor-grab active:cursor-grabbing" viewBox="-400 -300 800 600">
            {/* Draw Links */}
            {graph.links.map((link, idx) => {
              const sourceNode = graph.nodes.find((n) => n.id === link.source)
              const targetNode = graph.nodes.find((n) => n.id === link.target)
              if (!sourceNode || !targetNode) return null

              return (
                <line
                  key={idx}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  className={cn('stroke-[1.5] transition-all', groupLineColors[targetNode.group] || 'stroke-border')}
                />
              )
            })}

            {/* Draw Nodes */}
            {graph.nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id
              const isHighlighted = highlightedNodeIds.includes(node.id)
              const nodeRadius = node.val + 2

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Select Outer glow */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeRadius + 6}
                      className="fill-none stroke-luxury-emerald/40 stroke-2 animate-ping"
                    />
                  )}

                  {/* Search Highlight Glow */}
                  {isHighlighted && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeRadius + 8}
                      className="fill-none stroke-yellow-500/50 stroke-2 animate-pulse"
                    />
                  )}

                  {/* Base Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius}
                    className={cn(
                      'stroke-2 transition-all duration-300 hover:scale-110',
                      groupColors[node.group] || 'fill-border stroke-border'
                    )}
                  />

                  {/* Text Label */}
                  <text
                    x={node.x}
                    y={node.y + nodeRadius + 14}
                    textAnchor="middle"
                    className={cn(
                      'text-[9px] font-bold tracking-wide uppercase select-none pointer-events-none fill-text-secondary transition-colors font-outfit',
                      isSelected ? 'fill-white' : 'group-hover:fill-white'
                    )}
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </GlassCard>

        {/* Node inspector Side-panel */}
        <div className="lg:col-span-1">
          <GlassCard glowColor="emerald" className="p-6 flex flex-col gap-5 min-h-[350px]" hoverEffect={false}>
            {/* Panel Title */}
            <div className="flex flex-col gap-1.5 border-b border-border pb-4 select-none">
              <span className="text-[9px] text-text-emerald font-extrabold uppercase tracking-widest flex items-center gap-1">
                <Info size={12} /> Node Inspector
              </span>
              <h3 className="text-sm font-bold text-text-primary mt-1 font-outfit uppercase tracking-wide">
                {selectedNode?.label || 'Loading'}
              </h3>
            </div>

            {/* Variable definition */}
            <div className="flex flex-col gap-1 text-[11px] text-text-secondary leading-relaxed select-text">
              <span className="text-[9px] text-text-muted font-bold tracking-wider uppercase mb-1 block">Description</span>
              <p className="bg-surface-elevated/45 border border-border p-3.5 rounded-xl">
                {selectedNode?.desc || 'Loading graph from database.'}
              </p>
            </div>

            {/* Category mapping */}
            <div className="flex flex-col gap-1.5 select-none pt-2">
              <span className="text-[9px] text-text-muted font-bold tracking-wider uppercase">Domain Branch</span>
              <div className="flex gap-2">
                <Badge variant={selectedNode?.group === 1 ? 'emerald' : selectedNode?.group === 2 ? 'blue' : selectedNode?.group === 0 ? 'gold' : 'gray'}>
                  {selectedNode?.group === 0 ? 'Core Root' : selectedNode?.group === 1 ? 'Real Estate' : selectedNode?.group === 2 ? 'Automobiles' : selectedNode?.group === 3 ? 'Luxury' : 'Precious Metals'}
                </Badge>
              </div>
            </div>

            {/* Actions for learning */}
            <div className="pt-4 border-t border-border mt-auto">
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                <Award size={13} /> Deep Dive Lesson
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
export default Knowledge
