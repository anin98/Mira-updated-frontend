import { message } from 'antd'

export function useToast() {
  const toast = ({ type = 'info', content, duration = 3 }) => {
    message[type](content, duration)
  }

  const success = (content, duration) => toast({ type: 'success', content, duration })
  const error = (content, duration) => toast({ type: 'error', content, duration })
  const info = (content, duration) => toast({ type: 'info', content, duration })
  const warning = (content, duration) => toast({ type: 'warning', content, duration })

  return { toast, success, error, info, warning }
}

export default useToast
