export type InitialModalConfig = {
  title: string
  logo: string | null
  description: string | null
  decline: {
    type: 'button' | 'link' | 'inline' | 'disabled'
    text: string
    color: string
    inline: {
      text: string
      link: string
    }
  }
  more: {
    type: 'button' | 'link' | 'inline' | 'disabled'
    text: string
    color: string
    inline: {
      text: string
      link: string
    }
  }
  privacyPolicy: {
    type: 'button' | 'link' | 'inline' | 'disabled'
    text: string
    color: string
    inline: {
      text: string
      link: string
    }
  }
  accept: {
    type: 'button' | 'link'
    text: string
    color: string
  }
}

export type Purpose = {
  id: string
  title: string
  description: string
  services: Service[]
}

export type Service = {
  id: string
  title: string
  description: string
  required: boolean
}

export type PreferencesModalConfig = {
  title: string
  description: string | null
  logo: string | null
  updatedAt: string
  purposes: Purpose[]
}