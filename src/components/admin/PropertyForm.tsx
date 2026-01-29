
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Property } from "@/lib/types";

const propertySchema = z.object({
    title: z.string().min(5, "Title is required"),
    location: z.string().min(2, "Location is required"),
    area: z.string().min(2, "Area is required"),
    price: z.coerce.number().min(0),
    type: z.enum(["villa", "penthouse", "estate", "commercial", "residential"]),
    status: z.enum(["sale", "rent", "lease"]),
    beds: z.coerce.number().min(0),
    baths: z.coerce.number().min(0),
    sqft: z.coerce.number().min(0),
    description: z.string().min(10),
    heroImage: z.string().url("Must be a valid URL"),
    // Additional fields optional for simplicity in this MVP
});

interface PropertyFormProps {
    open: boolean;
    onClose: () => void;
    property?: Property | null;
}

export default function PropertyForm({ open, onClose, property }: PropertyFormProps) {
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof propertySchema>>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            title: "",
            location: "",
            area: "",
            price: 0,
            type: "residential",
            status: "sale",
            beds: 0,
            baths: 0,
            sqft: 0,
            description: "",
            heroImage: "",
        },
    });

    useEffect(() => {
        if (property) {
            form.reset({
                title: property.title,
                location: property.location,
                area: property.area,
                price: property.price,
                type: property.type,
                status: property.status,
                beds: property.beds,
                baths: property.baths,
                sqft: property.sqft,
                description: property.description,
                heroImage: property.heroImage,
            });
        } else {
            form.reset({
                title: "",
                location: "",
                area: "",
                price: 0,
                type: "residential",
                status: "sale",
                beds: 0,
                baths: 0,
                sqft: 0,
                description: "",
                heroImage: "",
            });
        }
    }, [property, form, open]);

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof propertySchema>) => {
            // Map form values to database column names (snake_case)
            const dbValues = {
                title: values.title,
                location: values.location,
                area: values.area,
                price: values.price,
                type: values.type,
                status: values.status,
                beds: values.beds,
                baths: values.baths,
                sqft: values.sqft,
                description: values.description,
                hero_image: values.heroImage,
                agent_id: "ag_02", // Default to admin agent for now
            };

            if (property) {
                // Update
                const { error } = await supabase
                    .from("properties" as any)
                    .update(dbValues)
                    .eq("id", property.id);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase.from("properties" as any).insert(dbValues);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_properties"] });
            toast.success(property ? "Property updated" : "Property added");
            onClose();
        },
        onError: (error) => {
            toast.error("Error: " + error.message);
        },
    });

    function onSubmit(values: z.infer<typeof propertySchema>) {
        mutation.mutate(values);
    }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{property ? "Edit Property" : "Add New Property"}</DialogTitle>
                    <DialogDescription>
                        Fill in the details below. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Property Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Luxury Villa in suburbs..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City / Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ghaziabad" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="area"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Area / Locality</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Crossings Republik" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="residential">Residential</SelectItem>
                                                <SelectItem value="commercial">Commercial</SelectItem>
                                                <SelectItem value="villa">Villa</SelectItem>
                                                <SelectItem value="penthouse">Penthouse</SelectItem>
                                                <SelectItem value="estate">Estate</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="sale">For Sale</SelectItem>
                                                <SelectItem value="rent">For Rent</SelectItem>
                                                <SelectItem value="lease">For Lease</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="beds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Beds</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="baths"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Baths</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sqft"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sq.Ft</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="heroImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Detailed property description..."
                                            className="resize-none h-32"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {property ? "Save Changes" : "Create Property"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
