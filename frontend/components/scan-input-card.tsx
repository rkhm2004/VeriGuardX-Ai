"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScanRequest } from "@/lib/types"
import { QrCode, FileText, Loader2 } from "lucide-react"

interface ScanInputCardProps {
  onSubmit: (data: ScanRequest) => Promise<void>
  loading: boolean
}

export function ScanInputCard({ onSubmit, loading }: ScanInputCardProps) {
  const [scanType, setScanType] = useState<"QR_SCAN" | "MANUAL_AUDIT">("QR_SCAN")
  const [formData, setFormData] = useState({
    qr_data: "",
    part_id: "",
    location: "",
    courier_id: "",
    user_description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const request: ScanRequest = {
      location: formData.location,
      courier_id: formData.courier_id,
      scan_type: scanType,
      ...(scanType === "QR_SCAN" 
        ? { qr_data: formData.qr_data }
        : { part_id: formData.part_id, user_description: formData.user_description }
      )
    }

    await onSubmit(request)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Part Scan Input</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={scanType} onValueChange={(v) => setScanType(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="QR_SCAN">
                <QrCode className="w-4 h-4 mr-2" />
                QR Scan
              </TabsTrigger>
              <TabsTrigger value="MANUAL_AUDIT">
                <FileText className="w-4 h-4 mr-2" />
                Manual Audit
              </TabsTrigger>
            </TabsList>

            <TabsContent value="QR_SCAN" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qr_data">QR Code Data</Label>
                <Input
                  id="qr_data"
                  placeholder="PART_ID|SERIAL_HASH|OEM_SIG"
                  value={formData.qr_data}
                  onChange={(e) => setFormData({ ...formData, qr_data: e.target.value })}
                  required={scanType === "QR_SCAN"}
                />
              </div>
            </TabsContent>

            <TabsContent value="MANUAL_AUDIT" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="part_id">Part ID</Label>
                <Input
                  id="part_id"
                  placeholder="PART_SERVO_12345"
                  value={formData.part_id}
                  onChange={(e) => setFormData({ ...formData, part_id: e.target.value })}
                  required={scanType === "MANUAL_AUDIT"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user_description">Description</Label>
                <Input
                  id="user_description"
                  placeholder="Black servo motor with 4 rivets..."
                  value={formData.user_description}
                  onChange={(e) => setFormData({ ...formData, user_description: e.target.value })}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="HUB_BERLIN"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courier_id">Courier ID</Label>
              <Input
                id="courier_id"
                placeholder="COR_JOHN_DOE_001"
                value={formData.courier_id}
                onChange={(e) => setFormData({ ...formData, courier_id: e.target.value })}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Scan...
              </>
            ) : (
              "Submit Scan"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}