export const messageConfig = [
  {
    order: "1",
    options: [
      {
        text: "Yes, That time works, Your order will be ready at that time.",
        nextOrder: "2",
      },
      {
        text: "No, that time does not work. Does {selectedDateTime} work instead? If not, my hours of operation are (insert hours of operation)",
        nextOrder: "3",
      },
      {
        text: "My apologies, but one or more of these items is no longer available, and this order has been canceled. Sorry for the inconvenience. Feel free to delete this chat whenever you have seen this message. If you do not delete this chat it will be automatically deleted after 72 hours",
        nextOrder: "1.1",
      },
    ],
  },
  {
    order: "2",
    options: [
      {
        text: "Your order is ready to be picked up!",
        nextOrder: "6",
      },
    ],
  },
  {
    order: "3",
    options: [
      {
        text: "Fantastic, I will be there to pick up the item at the specified time.",
        nextOrder: "5",
      },
      {
        text: "No, that time does not work. Can it instead be ready at {selectedDateTime}",
        nextOrder: "4",
      },
    ],
  },
  {
    order: "4",
    options: [
      {
        text: "Yes, That time works, Your order will be ready at that time.",
        nextOrder: "2",
      },
      {
        text: "No, that time does not work. Does {selectedDateTime} work instead? If not, my hours of operation are (insert hours of operation)",
        nextOrder: "3",
      },
    ],
  },
  {
    order: "5",
    options: [
      {
        text: "Your order is ready to be picked up!",
        nextOrder: "6",
      },
    ],
  },
  {
    order: "6",
    options: [
      {
        text: "I have Received my order. Thank you!",
        nextOrder: "7",
      },
    ],
  },
  {
    order: "7",
    options: [
      {
        text: "Fantastic, this order has been marked as completed, feel free to delete this chat. If you do not delete this chat it will be automatically deleted after 72 hours",
        nextOrder: "1.1",
      },
    ],
  },
  {
    order: "10",
    options: [
      {
        text: "I can deliver these items to you at {selectedDateTime}, does that work?",
        nextOrder: "11",
      },
      {
        text: "My apologies, but one or more of these items is no longer available, and this order has been canceled. Sorry for the inconvenience. Feel free to delete this chat whenever you have seen this message. If you do not delete this chat it will be automatically deleted after 72 hours",
        nextOrder: "1.1",
      },
    ],
  },
  {
    order: "11",
    options: [
      {
        text: "Yes, That time works, See you then!",
        nextOrder: "12",
      },
      {
        text: "No, that time does not work. Does {selectedDateTime} work instead? If not, my hours of operation are (insert hours of operation)",
        nextOrder: "13",
      },
    ],
  },
  {
    order: "12",
    options: [
      {
        text: "Your item has been delivered.",
        nextOrder: "6",
      },
    ],
  },
  {
    order: "13",
    options: [
      {
        text: "Yes, That time works. Your item will be delivered at that time.",
        nextOrder: "14",
      },
      {
        text: "No, that time does not work. Does {selectedDateTime} work instead?",
        nextOrder: "11",
      },
    ],
  },
  {
    order: "14",
    options: [
      {
        text: "Your item has been delivered.",
        nextOrder: "12",
      },
    ],
  },
];
