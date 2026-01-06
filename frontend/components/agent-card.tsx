import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AgentResult } from "@/lib/types"
import { getAgentIcon, calculateConfidenceColor } from "@/lib/utils"
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react"

interface AgentCardProps {
  agent: AgentResult
  link: string
}

export function AgentCard({ agent, link }: AgentCardProps) {
  const icon = getAgentIcon(agent.agent_name)
  const confidenceColor = calculateConfidenceColor(agent.confidence)

  return (
    <Link href={link}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <CardTitle className="text-lg">{agent.agent_name}</CardTitle>
            </div>
            {agent.passed ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-medium">{agent.confidence}%</span>
              </div>
              <Progress value={agent.confidence} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between">
              <Badge variant={agent.passed ? "default" : "destructive"}>
                {agent.passed ? "PASSED" : "FAILED"}
              </Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
            
            {agent.details.error && (
              <p className="text-xs text-red-600 line-clamp-2">
                {agent.details.error}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}