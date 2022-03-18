const gameCardStyles = (theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  cardActions: {
    flexWrap: 'wrap',
  },
  labels: {
    marginBottom: '15px',
    textAlign: 'left',
    width: '100%',
  },
});

export default gameCardStyles;
