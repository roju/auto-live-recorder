import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChooseDirectory, ValidateDownloadPath } from '../../wailsjs/go/main/App'
import { Folder } from "lucide-react"
import { useAutoSaveField } from "@/hooks/use-auto-save-field"
import { loadPreferences, savePreferences } from "@/lib/preferences";

const SettingsSchema = z.object({
  archiveFolder: z.string(),
  vodPathTemplate: z.string().min(1).max(100),
}).refine(
  async (data) => {
    try {
      await ValidateDownloadPath(data.archiveFolder, data.vodPathTemplate)
      return true
    } catch {
      return false
    }
  },
  {
    message: 'Invalid VOD path',
    path: ['vodPathTemplate'],
  }
)

// Highlighting regex and renderer
const HIGHLIGHT_REGEX = /(\{(?:platform|user|date|time|title)\})/g
function renderHighlighted(text: string) {
  return text.split(HIGHLIGHT_REGEX).map((part, i) =>
    HIGHLIGHT_REGEX.test(part) ? (
      <span key={i} className="text-blue-300">{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export function SettingsFiles() {
    
  const form = useForm({
    resolver: zodResolver(SettingsSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      archiveFolder: "",
      vodPathTemplate: "VODs/{platform}/{name}/{date}_{time}.mp4",
    },
  })

  useEffect(() => {
    loadPreferences().then(prefs => {
      if (prefs?.root_folder) {
        form.setValue("archiveFolder", prefs.root_folder)
      }
      if (prefs?.vod_path_template) {
        form.setValue("vodPathTemplate", prefs.vod_path_template)
      }
    })
  }, [])

  const archiveFolder = form.watch("archiveFolder")
  const vodPathTemplate = form.watch("vodPathTemplate")

  useAutoSaveField(archiveFolder, (path: string) => {
      console.log("Saving archive folder:", path)
      loadPreferences().then(prefs => {
          savePreferences({...prefs, root_folder: path})
      })
  })

  useAutoSaveField(vodPathTemplate, (tpl: string) => {
    console.log("Saving vod path template:", tpl)
    loadPreferences().then(prefs => {
      savePreferences({...prefs, vod_path_template: tpl})
    })
  })

  const handleChooseDirectory = async () => {
      try {
          const dir = await ChooseDirectory();
          if (dir) {
              form.setValue("archiveFolder", dir, {
                  shouldValidate: true,
                  shouldDirty: true,
              });
          }
      } catch (error) {
          console.error('Failed to choose directory:', error);
      }
  };

  return (
    <div className="flex">
      <Card className="w-full mx-4">
          <CardContent className="flex">
            <Form {...form}>
            <form className="space-y-6">

                {/* Archive folder */}
                <FormField
                    control={form.control}
                    name="archiveFolder"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-[auto_400px] items-center gap-x-4 gap-y-2">
                            <FormLabel className="text-right">Archive folder</FormLabel>
                            <p className="text-sm text-muted-foreground break-words">
                                {field.value || "No folder selected"}
                            </p>
                            <div />
                            <FormControl>
                                <div className="w-fit">
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={handleChooseDirectory}
                                    >
                                        <Folder /><span>Choose Folder</span>
                                    </Button>
                                </div>
                            </FormControl>
                            <div />
                            <FormDescription className="break-words">
                                Top-level folder where VODs will be stored and organized
                                <FormMessage/>
                            </FormDescription>
                            <Input type="hidden" {...field} />
                        </FormItem>
                    )}
                />

                {/* VOD path template */}
                <FormField
                    control={form.control}
                    name="vodPathTemplate"
                    render={({ field }) => {
                      const highlighted = useMemo(
                        () => renderHighlighted(vodPathTemplate ?? ""),
                        [vodPathTemplate]
                      )
                      return (
                        <FormItem className="grid grid-cols-[auto_400px] items-center gap-x-4 gap-y-2">
                            <FormLabel className="text-right">VOD path</FormLabel>
                            <div className="relative col-span-1">
                              {/* Highlight overlay */}
                              <div
                                aria-hidden
                                className="pointer-events-none absolute inset-0 px-3 py-2 whitespace-pre text-sm leading-[1.25rem]"
                              >
                                {highlighted}
                              </div>
                              {/* Actual input (transparent text, visible caret) */}
                              <Input
                                className="relative bg-transparent text-transparent caret-[var(--foreground)]"
                                {...field}
                              />
                            </div>
                            <div />
                            <div>
                              <FormMessage/>
                              <div className="col-span-1 text-sm text-muted-foreground break-words">
                                {`Template for naming and organizing VODs inside the Archive folder. Variables are enclosed in curly braces {}:`}
                                <div className="whitespace-pre font-mono">
                                  {`
{platform}\tLive streaming platform name (e.g. TikTok)
{user}\t\tStreamer's username (e.g. tv_asahi_news)
{date}\t\tStream start date (YYYY-MM-DD)
{time}\t\tStream start time in 24-hour format (HH-MM-SS)
{title}\t\tStream title (e.g. My Awesome Stream)`}
                                </div>
                              </div>
                            </div>
                        </FormItem>
                      )
                    }}
                />

            </form>
            </Form>
          </CardContent>
      </Card>
    </div>
  )
}

export default SettingsFiles