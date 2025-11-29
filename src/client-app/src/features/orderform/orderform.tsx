"use client"

import { useState } from "react"
import LockerMap from "./lockerMap"
import type { Locker } from "./lockerMap"
import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Dialog } from "@headlessui/react"

type TrustBadge = {
    name: string
    image: string
}

export const trustBadges: TrustBadge[] = [
    { name: "BLIK", image: "https://placehold.co/120x60/1e40af/ffffff?text=BLIK" },
    { name: "PayPal", image: "https://placehold.co/120x60/0070ba/ffffff?text=PayPal" },
    { name: "Visa", image: "https://placehold.co/120x60/1a1f71/ffffff?text=Visa" },
    { name: "Mastercard", image: "https://placehold.co/120x60/eb001b/ffffff?text=Mastercard" },
    { name: "Przelewy24", image: "https://placehold.co/120x60/d4021d/ffffff?text=P24" },
    { name: "Google Pay", image: "https://placehold.co/120x60/4285f4/ffffff?text=GPay" }
]

const OrderSchema = z.object({
    firstName: z.string().min(1, "Podaj imię"),
    lastName: z.string().min(1, "Podaj nazwisko"),
    email: z.string().email("Podaj poprawny adres email"),
    phone: z.string()
        .min(5, "Podaj numer telefonu")
        .max(16, "Numer telefonu jest za długi")
        .regex(/^\+?\d+$/, "Podaj poprawny numer telefonu"),
    street: z.string().min(1, "Podaj ulicę"),
    city: z.string().min(1, "Podaj miasto"),
    postalCode: z.string().regex(/^\d{2}-\d{3}$/, "Zachowaj format XX-XXX"),
    country: z.string().min(1, "Podaj kraj"),
    notes: z.string().min(1),
    paymentMethod: z.string().min(1, "Wybierz metodę płatności"),
    acceptPrivacy: z.boolean().refine(val => val === true, { message: "Musisz zaakceptować politykę prywatności" }),
    acceptTerms: z.boolean().refine(val => val === true, { message: "Musisz zaakceptować regulamin" }),
    deliveryMethod: z.enum(["address", "locker"])
})

export default function OrderForm() {
    const [showMapModal, setShowMapModal] = useState(false)
    const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null)


    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            street: "",
            city: "",
            postalCode: "",
            country: "",
            notes: " ",
            paymentMethod: "",
            acceptPrivacy: false,
            acceptTerms: false,
            deliveryMethod: "address",
        },
        validators: { onSubmit: OrderSchema },
        onSubmit: async ({ value }) => {
            alert("Zamówienie złożone! " + JSON.stringify(value, null, 2))
        },
    })

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-6">
            <h1 className="text-3xl font-bold">Formularz Zamówienia</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                {/* Imię i Nazwisko */}
                <div className="grid grid-cols-2 gap-4">
                    <form.Field name="firstName" children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field>
                                <FieldLabel htmlFor={field.name}>Imię</FieldLabel>
                                <Input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Imię"
                                    className={isInvalid ? "border-red-500" : ""}
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }} />
                    <form.Field name="lastName" children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field>
                                <FieldLabel htmlFor={field.name}>Nazwisko</FieldLabel>
                                <Input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Nazwisko"
                                    className={isInvalid ? "border-red-500" : ""}
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }} />
                </div>

                {/* Email i Telefon */}
                <form.Field name="email" children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                        <Field className="mt-4">
                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                            <Input
                                id={field.name}
                                type="email"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="email@example.com"
                                className={isInvalid ? "border-red-500" : ""}
                            />
                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                    )
                }} />

                <form.Field name="phone" children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                        <Field className="mt-4">
                            <FieldLabel htmlFor={field.name}>Numer telefonu</FieldLabel>
                            <Input
                                id={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="+48123456789"
                                className={isInvalid ? "border-red-500" : ""}
                            />
                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                    )
                }} />

                {/* Metoda dostawy z modalem paczkomatu */}
                <form.Field
                    name="deliveryMethod"
                    children={(field) => (
                        <Field className="mt-4">
                            <FieldLabel>Wybierz metodę dostawy</FieldLabel>
                            <div className="flex space-x-4 mt-2">
                                <label className="flex items-center space-x-1">
                                    <input
                                        type="radio"
                                        value="address"
                                        checked={field.state.value === "address"}
                                        onChange={() => {
                                            field.handleChange("address")
                                            setSelectedLocker(null)
                                        }}
                                    />
                                    <span>Dostawa pod adres</span>
                                </label>

                                <label className="flex items-center space-x-1">
                                    <input
                                        type="radio"
                                        value="locker"
                                        checked={field.state.value === "locker"}
                                        onChange={() => field.handleChange("locker")}
                                    />
                                    <span>Odbiór w paczkomacie</span>
                                </label>
                            </div>

                            {field.state.value === "locker" && (
                                <div className="mt-4">
                                    <Button
                                        type="button"
                                        onClick={() => setShowMapModal(true)}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                    >
                                        Wybierz paczkomat
                                    </Button>

                                    {selectedLocker && (
                                        <div className="mt-3 p-3 border rounde">
                                            <p className="font-medium">Wybrany paczkomat:</p>
                                            <p>{selectedLocker.name}</p>
                                            <p>
                                                Lokalizacja: {selectedLocker.lat}, {selectedLocker.lng}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Modal z mapą dla paczkomatów*/}
                            <Dialog
                                open={showMapModal}
                                onClose={() => setShowMapModal(false)}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                            >
                                <Dialog.Panel className="bg-neutral-800 rounded-lg p-4 w-[90%] max-w-3xl h-[50%]">
                                    <Dialog.Title className="text-lg font-semibold mb-2">
                                        Wybierz paczkomat
                                    </Dialog.Title>

                                    <LockerMap
                                        onSelectLocker={(locker) => {
                                            setSelectedLocker(locker);

                                            // ustawienie wartości w formularzu
                                            form.setFieldValue("street", locker.street);
                                            form.setFieldValue("city", locker.city);
                                            form.setFieldValue("postalCode", locker.postalCode);
                                            form.setFieldValue("country", locker.country);
                                        }}
                                    />


                                    <div className="mt-4 text-right">
                                        <Button
                                            onClick={() => setShowMapModal(false)}
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                        >
                                            Potwierdź
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </Dialog>
                        </Field>
                    )}
                />
                {/* Adres */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <form.Field name="country" children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field>
                                <FieldLabel htmlFor={field.name}>Kraj</FieldLabel>
                                <Input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Kraj"
                                    className={isInvalid ? "border-red-500" : ""}
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }} />
                    <form.Field name="city" children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field>
                                <FieldLabel htmlFor={field.name}>Miasto</FieldLabel>
                                <Input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Miasto"
                                    className={isInvalid ? "border-red-500" : ""}
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <form.Field name="postalCode" children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field>
                                <FieldLabel htmlFor={field.name}>Kod pocztowy</FieldLabel>
                                <Input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="00-000"
                                    className={isInvalid ? "border-red-500" : ""}
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }} />
                    <form.Field name="street" children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field>
                                <FieldLabel htmlFor={field.name}>Ulica i numer</FieldLabel>
                                <Input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Ulica i numer"
                                    className={isInvalid ? "border-red-500" : ""}
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        )
                    }} />
                </div>



                {/* Uwagi */}
                <form.Field name="notes" children={(field) => (
                    <Field className="mt-4">
                        <FieldLabel htmlFor={field.name}>Uwagi do zamówienia</FieldLabel>
                        <Textarea
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Np. proszę o kontakt telefoniczny"
                        />
                    </Field>
                )} />

                {/* Formy płatności */}
                <div className="mt-4">
                    <FieldLabel>Wybierz formę płatności</FieldLabel>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        {trustBadges.map((badge) => (
                            <form.Field key={badge.name} name="paymentMethod" children={(field) => {
                                const selected = field.state.value === badge.name
                                return (
                                    <button
                                        type="button"
                                        onClick={() => field.handleChange(badge.name)}
                                        className={`
                                flex items-center justify-center h-16 p-2 border rounded-lg transition
                                ${selected ? "border-blue-600 bg-orange-500 shadow-lg" : "border-gray-300 bg-white hover:bg-gray-100"}
                                focus:outline-none focus:ring-2 focus:ring-blue-400
                            `}
                                    >
                                        <img src={badge.image} alt={badge.name} className="h-10 object-contain" />
                                    </button>
                                )
                            }} />
                        ))}
                    </div>
                    <form.Field name="paymentMethod" children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return isInvalid ? <FieldError errors={field.state.meta.errors} /> : null
                    }} />
                </div>

                {/* Zgody */}
                <div className="mt-4 space-y-2">
                    <form.Field name="acceptPrivacy" children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={field.state.value}
                                        onCheckedChange={(val) => field.handleChange(!!val)}
                                    />
                                    <span>Akceptuję politykę prywatności</span>
                                </div>
                                <div className="mt-1 text-red-500 text-sm">
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </div>
                            </div>
                        )
                    }} />

                    <form.Field name="acceptTerms" children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={field.state.value}
                                        onCheckedChange={(val) => field.handleChange(!!val)}
                                    />
                                    <span>Akceptuję regulamin</span>
                                </div>
                                <div className="mt-1 text-red-500 text-sm">
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </div>
                            </div>
                        )
                    }} />
                </div>

                <Button type="submit" className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white">
                    Złóż zamówienie
                </Button>
            </form>
        </div>
    )
}
