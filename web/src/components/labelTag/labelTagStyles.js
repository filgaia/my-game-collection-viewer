const labelTagStyles = (theme) => ({
  chip: {
    marginLeft: '10px',
    '&:hover': {
      fontWeight: 'bold',
      boxShadow: '2px 2px 1px 0px rgba(0,0,0,0.5)',
    },
  },
  drawerChip: {
    marginLeft: 0,
    width: '100%',
  },
  seletedChip: {
    fontWeight: 'bold',
  },
});

export default labelTagStyles;
