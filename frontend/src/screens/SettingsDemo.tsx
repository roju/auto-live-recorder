import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function SettingsDemo() {

  return (
    <div className="flex justify-center">
      <Card className="w-full mx-4">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <div className="flex">
          <CardContent>
            <div className="space-y-6">

              {/* Username */}
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">Username</Label>
                <Input className="col-span-2" placeholder="yourusername" />
              </div>

              {/* Email */}
              <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                <Label className="text-right">Email</Label>
                <Input className="col-span-2" placeholder="you@example.com" />
                <div className="col-span-1"></div>
                <p className="col-span-2 text-sm text-muted-foreground">
                  We'll never share your email.
                </p>
              </div>

              {/* Notifications */}
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">Email Notifications</Label>
                <Checkbox className="col-span-2" />
              </div>
              
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}

export default SettingsDemo