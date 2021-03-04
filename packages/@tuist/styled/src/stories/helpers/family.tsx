import { Families, Icon } from '../..'

export const family: Families = {
  base: {
    blah: {
      component: Icon,
      props: (app: any) => ({
        icon: 'username',
        onClick() {
          console.log('it works', app.state.test)
        },
      }),
    },
  },
  work: {
    email: {
      component: Icon,
      props: { icon: 'email' },
    },
    folder: {
      component: Icon,
      props: { icon: 'folder' },
    },
  },
}
