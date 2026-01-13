import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AgentResult } from "@/lib/types"
import { getAgentIcon, calculateConfidenceColor } from "@/lib/utils"
import { CheckCircle2, XCircle, ArrowRight, Clock } from "lucide-react"
import { useVerification } from "@/lib/contexts/VerificationContext"

interface AgentCardProps {
  agent: AgentResult
  link: string
}

export function AgentCard({ agent, link }: AgentCardProps) {
  const { state } = useVerification()
  const icon = getAgentIcon(agent.agent_name)
  const confidenceColor = calculateConfidenceColor(agent.confidence)

  // Get progress from context based on agent name
  const getProgressFromContext = () => {
    const agentKey = agent.agent_name.toLowerCase().replace(' agent', '') as keyof typeof state.agents
    return state.agents[agentKey] || agent.confidence
  }

  const progress = getProgressFromContext()
  const isCompleted = progress === 100
  const isInProgress = progress > 0 && progress < 100
  const isPending = progress === 0

  return (
    <Link href={link}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <CardTitle className="text-lg">{agent.agent_name}</CardTitle>
            </div>
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : isInProgress ? (
              <Clock className="w-5 h-5 text-yellow-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between">
              <Badge variant={isCompleted ? "default" : isInProgress ? "secondary" : "destructive"}>
                {isCompleted ? "COMPLETED" : isInProgress ? "IN PROGRESS" : "PENDING"}
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
