import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CourierAgentResult } from "@/lib/types"
import { CheckCircle2, XCircle, User, Clock, MapPin, Shield } from "lucide-react"

interface CourierBadgeProps {
  courier: CourierAgentResult
}

export function CourierBadge({ courier }: CourierBadgeProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            courier.passed ? "bg-green-100" : "bg-red-100"
          }`}>
            <User className={`w-6 h-6 ${
              courier.passed ? "text-green-600" : "text-red-600"
            }`} />
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{courier.courier_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {courier.details.courier_id}
                </p>
              </div>
              {courier.passed ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Shift Status</p>
                  <Badge variant={courier.shift_valid ? "default" : "destructive"} className="mt-1">
                    {courier.shift_valid ? "On Duty" : "Off Duty"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Region Auth</p>
                  <Badge variant={courier.region_authorized ? "default" : "destructive"} className="mt-1">
                    {courier.region_authorized ? "Authorized" : "Unauthorized"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Clearance</p>
                  <Badge variant="outline" className="mt-1">
                    {courier.clearance_level}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4" />
                <div>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className="font-semibold">{courier.confidence}%</p>
                </div>
              </div>
            </div>

            {!courier.passed && courier.details.failure_reasons && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm font-medium text-red-900 mb-1">Issues Detected:</p>
                <ul className="text-xs text-red-700 space-y-1">
                  {courier.details.failure_reasons.map((reason: string, index: number) => (
                    <li key={index}>• {reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}