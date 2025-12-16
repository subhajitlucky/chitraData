export const parseData = (dataStr: string): number[] => {
    return dataStr.split(',')
        .map(item => parseFloat(item.trim()))
        .filter(item => !isNaN(item));
};

export const getMaxValue = (datasets: { data: string }[]) => {
    return Math.max(...datasets.flatMap(ds => parseData(ds.data)));
};
