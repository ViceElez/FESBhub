export interface PopupProperties {
    isOpen: boolean
    onClose: () => void
    id: number
    onSuccess?: () => void
}