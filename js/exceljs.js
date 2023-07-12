const excelDownloadFn = () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('시트1');

    sheet.columns = [
      {header: '데이터', key: 'data'},
    ]

    const sampleData = [
      { data: '살|등등한모반쿰[' }, 
      { data: '신성희귀투구101' }, 
      { data: '아이템위력679' }, 
      { data: '방어도849()' }, 
      { data: '민첩+33+[24-34]' }, 
      { data: '광폭화상태일때공격력+7.5%' }, 
      { data: '[5.0-10.0]%' }, 
      { data: '암흑저항22.5%[19.5-34.5]%' }, 
      { data: '결정타등급+2[9](야만용사전용)' }, 
      { data: '요구레벨:62' }, 
      { data: '야만용사' }, 
    ];

    sampleData.map((item) => {
      sheet.addRow(item);
    });
 
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `BillScanner.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    })
  } catch(error) {
    console.error(error);
  }
}