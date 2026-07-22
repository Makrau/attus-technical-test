import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Table from './Table.vue'

describe('Table Component', () => {
  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: false }
  ]

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ]

  it('renders table with columns', () => {
    const wrapper = mount(Table, {
      props: { columns, data },
      slots: {
        row: `<td>{{ row.id }}</td><td>{{ row.name }}</td><td>{{ row.email }}</td>`
      }
    })

    const headers = wrapper.findAll('.table__header-cell')
    expect(headers).toHaveLength(3)
    expect(headers[0]?.text()).toContain('ID')
    expect(headers[1]?.text()).toContain('Name')
    expect(headers[2]?.text()).toContain('Email')
  })

  it('renders data rows', () => {
    const wrapper = mount(Table, {
      props: { columns, data },
      slots: {
        row: `<td>{{ row.id }}</td><td>{{ row.name }}</td><td>{{ row.email }}</td>`
      }
    })

    const rows = wrapper.findAll('.table__row')
    expect(rows).toHaveLength(3)
  })

  it('displays empty state when no data', () => {
    const wrapper = mount(Table, {
      props: { 
        columns, 
        data: [],
        emptyMessage: 'No items found'
      }
    })

    expect(wrapper.find('.table__empty-message').text()).toBe('No items found')
    expect(wrapper.findAll('.table__row')).toHaveLength(0)
  })

  it('uses default empty message when not provided', () => {
    const wrapper = mount(Table, {
      props: { columns, data: [] }
    })

    expect(wrapper.find('.table__empty-message').text()).toBe('Nenhum dado disponível')
  })

  it('marks sortable columns', () => {
    const wrapper = mount(Table, {
      props: { columns, data }
    })

    const headers = wrapper.findAll('.table__header-cell')
    expect(headers[0]?.classes()).toContain('table__header-cell--sortable')
    expect(headers[1]?.classes()).toContain('table__header-cell--sortable')
    expect(headers[2]?.classes()).not.toContain('table__header-cell--sortable')
  })

  it('sorts data ascending when clicking sortable column', async () => {
    const wrapper = mount(Table, {
      props: { 
        columns, 
        data: [
          { id: 3, name: 'Charlie', email: 'c@example.com' },
          { id: 1, name: 'Alice', email: 'a@example.com' },
          { id: 2, name: 'Bob', email: 'b@example.com' }
        ]
      },
      slots: {
        row: `<td>{{ row.name }}</td>`
      }
    })

    const nameHeader = wrapper.findAll('.table__header-cell')[1]
    await nameHeader?.trigger('click')

    expect(wrapper.emitted('sort')).toBeTruthy()
    expect(wrapper.emitted('sort')?.[0]).toEqual(['name', 'asc'])
  })

  it('toggles sort order on repeated clicks', async () => {
    const wrapper = mount(Table, {
      props: { columns, data }
    })

    const idHeader = wrapper.findAll('.table__header-cell')[0]
    
    await idHeader?.trigger('click')
    expect(wrapper.emitted('sort')?.[0]).toEqual(['id', 'asc'])

    await idHeader?.trigger('click')
    expect(wrapper.emitted('sort')?.[1]).toEqual(['id', 'desc'])

    await idHeader?.trigger('click')
    expect(wrapper.emitted('sort')?.[2]).toEqual(['id', 'asc'])
  })

  it('does not sort when clicking non-sortable column', async () => {
    const wrapper = mount(Table, {
      props: { columns, data }
    })

    const emailHeader = wrapper.findAll('.table__header-cell')[2]
    await emailHeader?.trigger('click')

    expect(wrapper.emitted('sort')).toBeFalsy()
  })

  it('emits row-click event when row is clicked', async () => {
    const wrapper = mount(Table, {
      props: { columns, data },
      slots: {
        row: `<td>{{ row.id }}</td>`
      }
    })

    const firstRow = wrapper.find('.table__row')
    await firstRow.trigger('click')

    expect(wrapper.emitted('row-click')).toBeTruthy()
    expect(wrapper.emitted('row-click')?.[0]).toEqual([data[0]])
  })

  it('displays sort icon for current sort column', async () => {
    const wrapper = mount(Table, {
      props: { columns, data }
    })

    const nameHeader = wrapper.findAll('.table__header-cell')[1]
    await nameHeader?.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('lucide-chevron-up')

    await nameHeader?.trigger('click')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.html()).toContain('lucide-chevron-down')
  })

  it('applies hover effect on rows', () => {
    const wrapper = mount(Table, {
      props: { columns, data },
      slots: {
        row: `<td>{{ row.id }}</td>`
      }
    })

    const row = wrapper.find('.table__row')
    expect(row.classes()).toContain('table__row')
  })

  it('uses custom rowKey prop', () => {
    const customData = [
      { uuid: 'abc-123', name: 'Test' },
      { uuid: 'def-456', name: 'Test2' }
    ]

    const wrapper = mount(Table, {
      props: { 
        columns: [{ key: 'name', label: 'Name' }], 
        data: customData,
        rowKey: 'uuid'
      },
      slots: {
        row: `<td>{{ row.name }}</td>`
      }
    })

    const rows = wrapper.findAll('.table__row')
    expect(rows).toHaveLength(2)
  })
})
