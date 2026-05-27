import toast from 'react-hot-toast'

/* =========================================
   REQUEST NOTIFICATION PERMISSION
========================================= */

export const requestNotificationPermission =
  async () => {
    try {
      if (!('Notification' in window)) {
        console.log(
          'Browser does not support notifications'
        )
        return
      }

      if (
        Notification.permission === 'default'
      ) {
        await Notification.requestPermission()
      }
    } catch (error) {
      console.log(
        'Notification permission error:',
        error
      )
    }
  }

/* =========================================
   SHOW MESSAGE NOTIFICATION
========================================= */

export const showMessageNotification = ({
  title = 'New Message',
  body = 'You received a new message',
  icon = '/vite.svg',
}) => {
  try {
    /* WEBSITE TOAST */

    toast.success(body)

    /* BROWSER NOTIFICATION */

    if (!('Notification' in window)) return

    if (
      Notification.permission === 'granted'
    ) {
      const notification = new Notification(
        title,
        {
          body,
          icon,
        }
      )

      /* AUTO CLOSE */

      setTimeout(() => {
        notification.close()
      }, 5000)

      /* OPEN WEBSITE ON CLICK */

      notification.onclick = () => {
        window.focus()
      }
    }
  } catch (error) {
    console.log(
      'Notification show error:',
      error
    )
  }
}