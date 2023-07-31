import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import Loading from '../Loading.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(Loading)
    expect(wrapper.text()).toContain('Loading...')
  })
})
