import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme, Theme } from "@/components/theme-provider"
import { loadPreferences, savePreferences } from "@/lib/preferences";

function SettingsGeneral() {
  const { theme, setTheme } = useTheme()

  function handleChangeTheme(value: string) {
    setTheme(value as Theme)
    loadPreferences().then(prefs => {
      savePreferences({...prefs, theme: value})
    })
  }

  return (
    <div className="flex">
      <Card className="w-full mx-4">
          <CardContent className="flex">
            <div className="space-y-6">

              {/* Theme */}
              <div className="grid grid-cols-[auto_400px] items-center gap-x-4 gap-y-2">
                <Label className="text-right">Theme</Label>
                <Select 
                  value={theme}
                  onValueChange={handleChangeTheme}
                >
                  <SelectTrigger className="">
                    <SelectValue className="capitalize" placeholder={theme} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <div className="col-span-1"></div>
                <p className="text-sm text-muted-foreground break-words">
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