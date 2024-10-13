import React from 'react'
import { CTable } from '@coreui/react'

const Schedule = () => {
  const columns = [
    {
      key: 'id',
      label: 'Day of the week',
      _props: { scope: 'col' },
    },
    {
      key: 'class',
      _props: { scope: 'col' },
    },
  ]
  const items = [
    {
      id: 'Monday',
      class: ' ',
      description: ' ',
      _cellProps: {
        id: { scope: 'row', style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' } },
        class: {
          scope: 'row',
          style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' },
        },
      },
    },
    {
      id: '7:00 am - 8:00 am',
      class: 'Boxing for all',
      description: 'Come have fun',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 am - 9:30 am',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '3:30 pm - 4:15 pm',
      class: 'Kids class (Ages 5 - 9)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '4:00 pm - 5:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '5:00 pm - 6:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '6:00 pm - 7:00 pm',
      class: 'Advanced Class (All Ages)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '7:00 pm - 8:00 pm',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 pm - 10:00 pm',
      class: 'Late boxing',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 'Tuesday',
      class: ' ',
      description: ' ',
      _cellProps: {
        id: { scope: 'row', style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' } },
        class: {
          scope: 'row',
          style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' },
        },
        description: {
          scope: 'row',
          style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' },
        },
      },
    },
    {
      id: '7:00 am - 8:00 am',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 am - 9:30 am',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '3:30 pm - 4:15 pm',
      class: 'Kids class (Ages 5 - 9)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '4:00 pm - 5:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '5:00 pm - 6:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '6:00 pm - 7:00 pm',
      class: 'Advanced Class (All Ages)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '7:00 pm - 8:00 pm',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 pm - 10:00 pm',
      class: 'Late boxing',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 'Wednesday',
      class: ' ',
      description: ' ',
      _cellProps: {
        id: { scope: 'row', style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' } },
        class: {
          scope: 'row',
          style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' },
        },
        description: {
          scope: 'row',
          style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' },
        },
      },
    },
    {
      id: '7:00 am - 8:00 am',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 am - 9:30 am',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '3:30 pm - 4:15 pm',
      class: 'Kids class (Ages 5 - 9)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '4:00 pm - 5:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '5:00 pm - 6:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '6:00 pm - 7:00 pm',
      class: 'Advanced Class (All Ages)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '7:00 pm - 8:00 pm',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 pm - 10:00 pm',
      class: 'Late boxing',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 'Thursday',
      class: ' ',
      description: ' ',
      _cellProps: {
        id: { scope: 'row', style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' } },
        class: {
          scope: 'row',
          style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' },
        },
        description: {
          scope: 'row',
          style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' },
        },
      },
    },
    {
      id: '7:00 am - 8:00 am',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 am - 9:30 am',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '3:30 pm - 4:15 pm',
      class: 'Kids class (Ages 5 - 9)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '4:00 pm - 5:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '5:00 pm - 6:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '6:00 pm - 7:00 pm',
      class: 'Advanced Class (All Ages)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '7:00 pm - 8:00 pm',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 pm - 10:00 pm',
      class: 'Late boxing',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 'Friday',
      class: ' ',
      description: ' ',
      _cellProps: {
        id: { scope: 'row', style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' } },
        class: {
          scope: 'row',
          style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' },
        },
        description: {
          scope: 'row',
          style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' },
        },
      },
    },
    {
      id: '7:00 am - 8:00 am',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 am - 9:30 am',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '3:30 pm - 4:15 pm',
      class: 'Kids class (Ages 5 - 9)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '4:00 pm - 5:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '5:00 pm - 6:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '6:00 pm - 7:00 pm',
      class: 'Advanced Class (All Ages)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '7:00 pm - 8:00 pm',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 pm - 10:00 pm',
      class: 'Late boxing',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 'Saturday',
      class: ' ',
      description: ' ',
      _cellProps: {
        id: { scope: 'row', style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' } },
        class: {
          scope: 'row',
          style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' },
        },
        description: {
          scope: 'row',
          style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' },
        },
      },
    },
    {
      id: '7:00 am - 8:00 am',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 am - 9:30 am',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '3:30 pm - 4:15 pm',
      class: 'Kids class (Ages 5 - 9)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '4:00 pm - 5:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '5:00 pm - 6:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '6:00 pm - 7:00 pm',
      class: 'Advanced Class (All Ages)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '7:00 pm - 8:00 pm',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 pm - 10:00 pm',
      class: 'Late boxing',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 'Sunday',
      class: ' ',
      description: ' ',
      _cellProps: {
        id: { scope: 'row', style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' } },
        class: {
          scope: 'row',
          style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' },
        },
        description: {
          scope: 'row',
          style: { backgroundColor: 'red', color: 'white', fontWeight: 'bold' },
        },
      },
    },
    {
      id: '7:00 am - 8:00 am',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 am - 9:30 am',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '3:30 pm - 4:15 pm',
      class: 'Kids class (Ages 5 - 9)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '4:00 pm - 5:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '5:00 pm - 6:00 pm',
      class: 'Youth Class (Ages 10 - 15)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '6:00 pm - 7:00 pm',
      class: 'Advanced Class (All Ages)',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '7:00 pm - 8:00 pm',
      class: 'Boxing for all',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: '8:30 pm - 10:00 pm',
      class: 'Late boxing',
      _cellProps: { id: { scope: 'row' } },
    },
  ]
  return <CTable columns={columns} items={items} />
}

export default Schedule
