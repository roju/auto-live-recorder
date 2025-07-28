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
// import { useForm, SubmitHandler } from "react-hook-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { ChooseDirectory } from '../../wailsjs/go/main/App';

const supportedPlatforms = [
    { label: "TikTok", value: "tiktok" },
] as const

const httpUrl = z.url({
  protocol: /^https?$/,
  hostname: z.regexes.domain
});

const FormSchema = z.object({
    liveURL: httpUrl.optional().or(z.literal('')),
    platform: z.string(),
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
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            autorecord: true
        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("form submit: ", JSON.stringify(data, null, 2))
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
            }
        } catch (error) {
            console.error('Failed to choose directory:', error);
        }
    };

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
                                            type="url"
                                            className="col-span-2"
                                            placeholder="https://www.tiktok.com/@username/live"
                                            {...field}
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
                                                        ? supportedPlatforms.find(
                                                            (platform) => platform.value === field.value
                                                        )?.label
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
                                                                value={platform.label}
                                                                key={platform.value}
                                                                onSelect={() => {
                                                                    form.setValue("platform", platform.value)
                                                                }}
                                                            >
                                                                {platform.label}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        platform.value === field.value
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
                                            type="text" 
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            className="col-span-2" 
                                            placeholder="tv_asahi_news" 
                                            {...field} 
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
                                    <FormLabel className="text-right">Download folder</FormLabel>
                                    <p className="col-span-2 text-sm text-muted-foreground break-words">
                                        {/* ~/Downloads/auto-live-recorder */}
                                        {field.value || "No folder selected"}
                                    </p>
                                    <div className="col-span-1"/>
                                    <FormControl>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={handleChooseDirectory} 
                                            className="col-span-2"
                                        >
                                                <Folder/><span>Choose Folder</span>
                                        </Button>
                                    </FormControl>
                                    <div className="col-span-1" />
                                    <FormDescription className="col-span-2">
                                        {/* Folder where streamer's VODs will be saved */}
                                        <FormMessage/>
                                    </FormDescription>
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