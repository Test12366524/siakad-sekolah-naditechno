import type { KanbanData } from './types'

const img5 = getPublicUrl('/images/pages/5.jpg')
const avatar1 = getPublicUrl('/images/avatars/avatar-1.png')
const avatar2 = getPublicUrl('/images/avatars/avatar-2.png')
const avatar3 = getPublicUrl('/images/avatars/avatar-3.png')

export const database: KanbanData = {
  boards: [
    {
      id: 1,
      title: 'In Progress',
      itemsIds: [1, 2, 3],
    },
    {
      id: 2,
      title: 'In Review',
      itemsIds: [4, 5],
    },
    {
      id: 3,
      title: 'Done',
      itemsIds: [6],
    },
  ],
  items: [
    {
      id: 1,
      title: 'Research FAQ page UX',
      dueDate: '',
      labels: ['UX'],
      members: [{ img: avatar1, name: 'John Doe' }, { img: avatar2, name: 'Jane Smith' }],
      comments: 'No Comment',
      attachments: 2,
      commentsCount: 1,
      image: '',
    },
    {
      id: 2,
      title: 'Review JavaScript code',
      dueDate: '',
      labels: ['Code Review'],
      members: [{ img: avatar3, name: 'Robert Johnson' }, { img: avatar1, name: 'Emily Davis' }, { img: avatar2, name: 'Tom Smith' }],
      comments: 'No Comment',
      attachments: 2,
      commentsCount: 4,
      image: '',
    },
    {
      id: 3,
      title: 'Review completed Apps',
      dueDate: '',
      labels: ['Dashboard'],
      members: [{ img: avatar1, name: 'David Smith' }, { img: avatar2, name: 'Jane Smith' }],
      comments: 'No Comment',
      image: '',
      attachments: 5,
      commentsCount: 10,
    },
    {
      id: 4,
      title: 'Find new images for pages',
      dueDate: '',
      labels: ['Image'],
      members: [{ img: avatar1, name: 'David Smit' }, { img: avatar2, name: 'John Doe' }],
      comments: 'No Comment',
      image: img5,
      attachments: 5,
      commentsCount: 4,
    },
    {
      id: 5,
      title: 'Forms & tables section',
      dueDate: '',
      labels: ['Bug'],
      members: [{ img: avatar1, name: 'Tom Smith' }, { img: avatar2, name: 'Emily Davis' }],
      comments: 'No Comment',
      attachments: 7,
      commentsCount: 2,
      image: '',
    },
    {
      id: 6,
      title: 'Completed charts & maps',
      dueDate: '',
      labels: ['Bug'],
      members: [{ img: avatar1, name: 'Robert Johnson' }, { img: avatar2, name: 'Jane Smith' }],
      comments: 'No Comment',
      attachments: 1,
      commentsCount: 10,
      image: '',
    },
  ],
}
