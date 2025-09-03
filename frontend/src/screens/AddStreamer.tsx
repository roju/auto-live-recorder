import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Check, ChevronsUpDown, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { ChooseDirectory } from '../../wailsjs/go/main/App'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { supportedPlatforms, platformMap } from "@/data/supported-platforms"
import { extractPlatformFromUrl } from "@/lib/utils"
import { Streamer, StreamingPlatform } from "@/types/app-types";
import { appStore } from "../state/app-state";
import { useEffect, useState } from "react";

const httpUrl = z.url({
  protocol: /^https?$/,
  hostname: z.regexes.domain
});

const FormSchema = z.object({
    liveURL: httpUrl.optional().or(z.literal('')),
    platform: z.custom<StreamingPlatform>(),
    username: z.string().min(1).max(32),
    folder: z.string(),
    autorecord: z.boolean()
})

/* 
 ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████
██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██
██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██
██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██
 ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██
*/

export function AddStreamer() {
    var vodFolderOverride: boolean = false;
    const vodFolderTemplate = appStore(state => 
        `${state.prefs.root_folder}/${state.prefs.vod_path_template}`
        // Remove the filename from the template to get the directory
        .replace(/\/+$/, "")
    )

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("AddStreamer form submit: ", JSON.stringify(data, null, 2))

        await appStore.getState().addStreamer(new Streamer(
            data.platform.name,
            data.username,
            "monitoring",
            "unknown",
            "unknown",
            0,
            data.autorecord,
            data.folder
        ))
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            autorecord: true,
            username: "",
            liveURL: "",
            platform: platformMap.get("tiktok")!,
            folder: "",
        }
    })

    useEffect(() => {
        appStore.getState().hydratePrefs()
    }, [])

    function vodFolderPath(vodFolderTemplate: string, platform: StreamingPlatform, user: string) {
        const lastSlash = vodFolderTemplate.lastIndexOf("/")
        const templateDir = lastSlash !== -1 ? vodFolderTemplate.slice(0, lastSlash) : ""
        const dirWithPlatform = templateDir.replace(/\{platform\}/g, platform.displayName)
        const dirWithUsername = user ? dirWithPlatform.replace(/\{user\}/g, user) : dirWithPlatform
        return dirWithUsername
    }

    function HandleDialogOpenChange(open: boolean) {
        if (open) {
            form.reset()
            form.setValue("platform", "tiktok")
        }
    }

    const handleChooseDirectory = async () => {
        try {
            const dir = await ChooseDirectory();
            if (dir) {
                form.setValue("folder", dir, {
                    shouldValidate: true,
                    shouldDirty: true,
                });
                vodFolderOverride = true
            }
        } catch (error) {
            console.error('Failed to choose directory:', error);
        }
    };

	// Helper to update folder when username changes
	function updateFolderForUsername(username: string) {
        const newFolder = vodFolderPath(vodFolderTemplate, form.getValues("platform"), username);
        if (!vodFolderOverride) {
			form.setValue("folder", newFolder, {
				shouldValidate: true,
				shouldDirty: true,
			});
        }
	}

    function usernameFieldOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        const username = e.target.value;
        const platform = form.getValues("platform")
        // Update the liveURL based on the username and platform
        const newLiveUrl = username && platform ? platform.liveUrlFromUsername(username) : "" 

        form.setValue("liveURL", newLiveUrl, {
            shouldValidate: true,
            shouldDirty: true,
        })
		// Update folder: {user} -> username (or back to {user} if empty)
		updateFolderForUsername(username)

        // Ensure username is re-validated immediately
        if (username?.length >= 1) {
            form.clearErrors("username")
        }
        form.trigger("username")
    }

    function liveUrlFieldOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        const liveURL = e.target.value;
        const platform = extractPlatformFromUrl(liveURL);
        if (platform) {
            console.log("Extracted platform:", platform.name);
            const username = platform.usernameFromUrl(liveURL) || "";
            console.log("Extracted username:", username);
            form.setValue("username", username, {
                shouldValidate: true,
                shouldDirty: true,
            });
			// Also update folder based on derived username
			updateFolderForUsername(username)
            // Re-validate username after programmatic change
            form.trigger("username")
        }
    }

/*
██████  ███████ ████████ ██    ██ ██████  ███    ██
██   ██ ██         ██    ██    ██ ██   ██ ████   ██
██████  █████      ██    ██    ██ ██████  ██ ██  ██
██   ██ ██         ██    ██    ██ ██   ██ ██  ██ ██
██   ██ ███████    ██     ██████  ██   ██ ██   ████
*/

    return (
        <Dialog onOpenChange={HandleDialogOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="ml-auto">
                    <Plus />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Streamer</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
{/*
██      ██ ██    ██ ███████     ██    ██ ██████  ██
██      ██ ██    ██ ██          ██    ██ ██   ██ ██
██      ██ ██    ██ █████       ██    ██ ██████  ██
██      ██  ██  ██  ██          ██    ██ ██   ██ ██
███████ ██   ████   ███████      ██████  ██   ██ ███████
*/}
                        <FormField
                            control={form.control}
                            name="liveURL"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                                    <FormLabel className="text-right">Live URL <span className="text-muted-foreground">(optional)</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="url"
                                            className="col-span-2"
                                            placeholder={
                                                form.getValues("platform")?.liveUrlFromUsername("username")
                                            }
                                            onChange={(e) => {
                                                field.onChange(e);
                                                liveUrlFieldOnChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    <div className="col-span-1" />
                                    <FormMessage className="col-span-2" />
                                </FormItem>
                            )}
                        />
{/*
██████  ██       █████  ████████ ███████  ██████  ██████  ███    ███
██   ██ ██      ██   ██    ██    ██      ██    ██ ██   ██ ████  ████
██████  ██      ███████    ██    █████   ██    ██ ██████  ██ ████ ██
██      ██      ██   ██    ██    ██      ██    ██ ██   ██ ██  ██  ██
██      ███████ ██   ██    ██    ██       ██████  ██   ██ ██      ██
*/}
                        <FormField
                            control={form.control}
                            name="platform"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                                    <FormLabel className="text-right">Platform</FormLabel>
                                    <Popover>
                                        <PopoverTrigger disabled className="col-span-2" asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? field.value?.displayName 
                                                        : "Select platform"}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search platform..."
                                                    className="h-9"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No platform found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {supportedPlatforms.map((platform) => (
                                                            <CommandItem
                                                                value={platform.displayName}
                                                                key={platform.name}
                                                                onSelect={() => {
                                                                    form.setValue("platform", platform)
                                                                }}
                                                            >
                                                                {platform.displayName}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        platform.name === field.value.name
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <div className="col-span-1"/>
                                    <FormMessage className="col-span-2"/>
                                </FormItem>
                            )}
                        />
{/*
██    ██ ███████ ███████ ██████  ███    ██  █████  ███    ███ ███████
██    ██ ██      ██      ██   ██ ████   ██ ██   ██ ████  ████ ██
██    ██ ███████ █████   ██████  ██ ██  ██ ███████ ██ ████ ██ █████
██    ██      ██ ██      ██   ██ ██  ██ ██ ██   ██ ██  ██  ██ ██
 ██████  ███████ ███████ ██   ██ ██   ████ ██   ██ ██      ██ ███████
*/}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                                    <FormLabel className="text-right">Username</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            type="text" 
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            className="col-span-2" 
                                            placeholder="" 
                                            onChange={(e) => {
                                                field.onChange(e)
                                                usernameFieldOnChange(e)
                                            }}
                                        />
                                    </FormControl>
                                    <div className="col-span-1" />
                                    <FormMessage className="col-span-2"/>
                                </FormItem>
                            )}
                        />
{/*
███████  ██████  ██      ██████  ███████ ██████
██      ██    ██ ██      ██   ██ ██      ██   ██
█████   ██    ██ ██      ██   ██ █████   ██████
██      ██    ██ ██      ██   ██ ██      ██   ██
██       ██████  ███████ ██████  ███████ ██   ██
*/}

                        <FormField
                            control={form.control}
                            name="folder"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                                    <FormLabel className="text-right">VOD folder</FormLabel>
                                    <p className="col-span-2 text-sm text-muted-foreground break-words">
                                        {/* ~/Downloads/auto-live-recorder */}
                                        {field.value || "No folder selected"}
                                    </p>
                                    <div className="col-span-1"/>
                                    <FormControl>
                                        <div className="w-fit">
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={handleChooseDirectory} 
                                                className="col-span-2"
                                            >
                                                    <Folder/><span>Change Folder</span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <div className="col-span-1" />
                                    <div className="col-span-1" />
                                    <div className="col-span-2 text-sm text-muted-foreground break-words">
                                        {/* {`Changing this folder will override the default folder and template set in Settings > Files`} */}
                                        <FormMessage/>
                                    </div>
                                    {/* Hidden input to preserve form integration */}
                                    <Input type="hidden" {...field} />
                                </FormItem>
                            )}
                        />
{/*
 █████  ██    ██ ████████  ██████      ██████  ███████  ██████
██   ██ ██    ██    ██    ██    ██     ██   ██ ██      ██
███████ ██    ██    ██    ██    ██     ██████  █████   ██
██   ██ ██    ██    ██    ██    ██     ██   ██ ██      ██
██   ██  ██████     ██     ██████      ██   ██ ███████  ██████
*/}
                        <FormField
                            control={form.control}
                            name="autorecord"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                                    <FormLabel className="text-right">Auto-record</FormLabel>
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={(checked) => field.onChange(!!checked)}
                                            className="col-span-2"
                                        >
                                        </Checkbox>
                                    </FormControl>
                                    <div className="col-span-1" />
                                    <FormDescription className="col-span-2">
                                        Start recording when streamer goes live
                                        <FormMessage/>
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Add</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddStreamer