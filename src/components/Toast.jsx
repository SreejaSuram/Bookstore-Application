import React, { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export default function Toast() {
    const { notification, clearNotification } = useCart()

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                clearNotification()
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [notification, clearNotification])

    if (!notification) return null

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircle2 size={20} color="#16A34A" />
            case 'warning':
                return <AlertCircle size={20} color="#D97706" />
            case 'error':
                return <AlertCircle size={20} color="#DC2626" />
            default:
                return <Info size={20} color="#0284C7" />
        }
    }

    return (
        <div className="toast-container" role="status" aria-live="polite">
            <div className={`toast toast-${notification.type || 'info'}`}>
                {getIcon()}
                <div className="toast-content">{notification.message}</div>
                <button
                    onClick={clearNotification}
                    className="toast-close"
                    aria-label="Close notification"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    )
}
