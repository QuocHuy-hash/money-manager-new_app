import { useToast } from 'react-native-toast-notifications';

interface ToastProps {
    type: 'normal' | 'success' | 'warning' | 'danger' | 'custom';
    message: string;
}

export const useShowToast = () => {
    const toast = useToast();

    const showToast = ({ type, message }: ToastProps) => {
        toast.show(message, {
            type: type,
            placement: 'top',
            duration: 4000,
            animationType: 'slide-in',
        });
    };

    return showToast;
};
