import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider"

export function SettingsGeneral() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex justify-center">
      <Card className="w-full mx-4">
          <CardContent className="flex">
            <div className="space-y-6">

              {/* Theme */}
              <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                <Label className="text-right">Theme</Label>
                <Select 
                  onValueChange={(value) => setTheme(value as "light" | "dark" | "system")} 
                  defaultValue={theme}
                >
                  <SelectTrigger className="col-span-2">
                    <SelectValue className="capitalize" placeholder={theme} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <div className="col-span-1"></div>
                <p className="col-span-2 text-sm text-muted-foreground">
                  System will follow your OS preferences.
                </p>
              </div>

            </div>
          </CardContent>
      </Card>
    </div>
  )
}

export default SettingsGeneral