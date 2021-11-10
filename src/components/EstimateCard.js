import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {useHistory, useParams} from 'react-router-dom'
import CreateLine from "./CreateLine";
import './estimateCard.css'
import EditEstimate from "./EditEstimate";
import DeleteEstimate from "./DeleteEstimate";
import Loader from "./Loader";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/auth.context";
import {
   AlignmentType,
   Document,
   HeadingLevel,
   HeightRule,
   Packer,
   Paragraph,
   Table,
   TableCell,
   TableRow,
   TextRun,
   WidthType
} from "docx";
import {saveAs, autoBom} from 'file-saver'
import {ReactComponent as ReactLeft} from '../files/left.svg'
import {ReactComponent as ReactPlus} from '../files/plus.svg'
import {ReactComponent as ReactTrash} from '../files/trash.svg'
import {ReactComponent as ReactPencil} from '../files/pencil.svg'
import {ReactComponent as ReactDownload} from '../files/download.svg'
import DeleteLine from "./DeleteLine";
import EditLine from "./EditLine";

const EstimateCard = ({estimate}) => {
   const history = useHistory()
   const [lines, setLines] = useState([])
   const [index, setIndex] = useState({})
   const [subsections, setSubsections] = useState([])
   const [lineInfo, setLineInfo] = useState(null)
   const [listLine, setListLine] = useState([])
   const countRef = useRef(1)
   const countDocxRef = useRef(1)
   const [isEditEstimateOpen, setIsEditEstimateOpen] = useState(false)
   const {loading, request} = useHttp()
   const {token} = useContext(AuthContext)
   const estimateId = useParams().id

   const fetchedListLine = useCallback(async () => {
      try {
         const fetched = await request('https://vast-lowlands-22096.herokuapp.com/api/type-work-line', 'GET', null, {
            Authorization: `Bearer ${token}`
         })
         setListLine(fetched)
      }catch (e) {}
   }, [token, request])

   useEffect(() => {
      fetchedListLine()
   }, [fetchedListLine])


   const fetchedLines = useCallback(async () => {
      try {
         const fetched = await request('https://vast-lowlands-22096.herokuapp.com/api/lines', 'GET', null, {
            Authorization: `Bearer ${token}`,
            id: estimateId
         })
         fetched.sort((a, b) => {
            if (a.section > b.section) return 1;
            if (a.section < b.section) return -1;
            return 0;
         })
         const sections = [...new Set(fetched.filter(el => el.section !== '').map(el => el.section))]
         setSubsections(sections)
         setLines(fetched)
      }catch (e) {}
   }, [token, request, estimateId])


   useEffect(() => {
      fetchedLines()
   }, [fetchedLines])


   const buttonHandler = (id, el) => {
      setIndex(id)
      if(el) {
         setLineInfo(el)
      }
   }
//876    4630
   const downloadHandler = () => {
      const result = lines.map((el, i, arr) => {
         if (el.section !== '' && arr[i - 1]?.section !== el.section) {
            countDocxRef.current = 1
            return [
               new TableRow({
                  children: [
                     new TableCell({
                        width: {size: 8930, type: WidthType.DXA},
                        children: [new Paragraph({
                           children: [new TextRun({text: `Раздел: ${el.section}`, italics: true, color: '25476a'})]
                        })],
                        columnSpan: 5,
                     }),
                     new TableCell({
                        width: {size: 1500, type: WidthType.DXA},
                        children: [new Paragraph({
                           alignment: AlignmentType.CENTER,
                           children: [
                              new TextRun({
                                 text: `${arr
                                    .filter(element => element.section === el.section)
                                    .reduce((acc, ce) => acc + ce.totalPrice, 0).toFixed(2)}`,
                                 italics: true,
                                 color: '25476a'
                              })
                           ]
                        })],
                     })
                  ],
               }),

            ]
         }
         countDocxRef.current += 1
         if (el.section === '' && !arr[i - 1]) {
            countDocxRef.current = 1
         }
         return [
            new TableRow({
               children: [
                  new TableCell({
                     width: {size: 876, type: WidthType.DXA},
                     children:[new Paragraph({text: `${countDocxRef.current}`, alignment: AlignmentType.CENTER})]
                  }),
                  new TableCell({
                     width: {size: 4630, type: WidthType.DXA},
                     children:[new Paragraph({text: `${el.job}`, alignment: AlignmentType.CENTER})]
                  }),
                  new TableCell({
                     width: {size: 876, type: WidthType.DXA},
                     children:[new Paragraph({text: `${el.unit ? el.unit : '-'}`, alignment: AlignmentType.CENTER})]
                  }),
                  new TableCell({
                     width: {size: 876, type: WidthType.DXA},
                     children:[new Paragraph({text: `${el.count}`, alignment: AlignmentType.CENTER})]
                  }),
                  new TableCell({
                     width: {size: 876, type: WidthType.DXA},
                     children:[new Paragraph({text: `${el.price.toFixed(2)}`, alignment: AlignmentType.CENTER})]
                  }),
                  new TableCell({
                     width: {size: 876, type: WidthType.DXA},
                     children:[new Paragraph({text: `${el.totalPrice.toFixed(2)}`, alignment: AlignmentType.CENTER})]
                  })
               ]
            })
         ]
      })

      const tableHeader = new Table({
         columnWidths: [5430, 5000],
         rows: [
            new TableRow({
               height: {height: 500, rule: HeightRule},
               children: [
                  new TableCell({
                     width: {
                        size: 5430,
                        type: WidthType.DXA
                     },
                     children: [new Paragraph({
                        children: [
                           new TextRun({text: `Объект:`, bold: true}),
                           new TextRun({text: estimate.object, break: 1}),
                           new TextRun({text: '',  break: 2})
                        ]
                     })]
                  }),
                  new TableCell({
                     width: {
                        size: 5000,
                        type: WidthType.DXA
                     },
                     children: [new Paragraph({
                        children: [
                           new TextRun({text: `Заказчик:`, bold: true}),
                           new TextRun({text: estimate.customer, break: 1}),
                           new TextRun({text: '',  break: 2})
                        ]
                     })]
                  })
               ]
            })
         ]
      })
      const dates = new Paragraph({
         heading: HeadingLevel.HEADING_1,
         alignment: AlignmentType.CENTER,
         children: [new TextRun({text: date, break: 1 })]
      })
      const title = new Paragraph({
         heading: HeadingLevel.HEADING_3,
         alignment: AlignmentType.CENTER,
         children: [new TextRun({text: estimate.typeWork, bold: true})]
      })
      const tableWork = new Table({
         columnWidths: [800, 4630, 1000, 1000, 1500, 1500],
         rows: [
            new TableRow({
               children: [
                  new TableCell({
                     width: {size: 876, type: WidthType.DXA},
                     children:[new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                           new TextRun({text: '№', bold: true})
                        ]
                     })]
                  }),
                  new TableCell({
                     width: {size: 4630, type: WidthType.DXA},
                     children:[new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                           new TextRun({text: 'Наименование', bold: true})
                        ]
                     })]
                  }),
                  new TableCell({
                     width: {size: 876, type: WidthType.DXA},
                     children:[new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                           new TextRun({text: 'Ед. изм.',  bold: true})
                        ]
                     })]
                  }),
                  new TableCell({
                     width: {size: 876, type: WidthType.DXA},
                     children:[new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                           new TextRun({text: 'Кол-во',  bold: true})
                        ]
                     })]
                  }),
                  new TableCell({
                     width: {size: 876, type: WidthType.DXA},
                     children:[new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                           new TextRun({text: 'Стоимость', bold: true})
                        ]
                     })]
                  }),
                  new TableCell({
                     width: {size: 876, type: WidthType.DXA},
                     children:[new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                           new TextRun({text: 'Сумма', bold: true})
                        ]
                     })]
                  })
               ],
               tableHeader: true
            }),
            new TableRow({
               children: [
                  new TableCell({
                     width: {size: 8930, type: WidthType.DXA},
                     children: [new Paragraph({
                        children: [
                           new TextRun({text: 'Смета',  bold: true})
                        ]
                     })],
                     columnSpan: 5,
                     shading: true

                  }),
                  new TableCell({
                     width: {size: 1500, type: WidthType.DXA},
                     children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                           new TextRun({text: `${estimate.totalPrice.toFixed(2)}`, bold: true})
                        ]
                     })],
                  })
               ],
            }),
            ...result.flat(),
            new TableRow({
               height: {height: 1000, rule: HeightRule},
               children: [
                  new TableCell({
                     width: {size: 8930, type: WidthType.DXA},
                     children: [new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                           new TextRun({text: 'Итого по смете',  bold: true}),
                           new TextRun({text: '',  break: 2})
                        ]
                     })],
                     columnSpan: 5,
                     shading: true

                  }),
                  new TableCell({
                     width: {size: 1500, type: WidthType.DXA},
                     children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                           new TextRun({text: `${estimate.totalPrice.toFixed(2)}`, bold: true}),
                           new TextRun({text: '',  break: 2})
                        ]
                     })],
                  })
               ],
            }),
            new TableRow({
               height: {height: 1000, rule: HeightRule},
               children: [
                  new TableCell({
                     width: {size: 2000, type: WidthType.DXA},
                     children: [new Paragraph({
                        children: [
                           new TextRun({text: 'Сумма',  bold: true}),
                           new TextRun({text: '(п)',  bold: true, break: 1}),
                           new TextRun({text: '',  break: 1})
                        ]
                     })],
                     shading: true

                  }),
                  new TableCell({
                     width: {size: 1500, type: WidthType.DXA},
                     children: [new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                           new TextRun({text: `${estimate.totalPriceToString}`, bold: true}),
                           new TextRun({text: '',  break: 2})
                        ]
                     })],
                     columnSpan: 5
                  })
               ],
            }),
         ]
      })


      const doc = new Document({
         creator: estimate.contractor,
         title: estimate.object + date,
         sections: [{
            properties: {},
            children: [
               tableHeader,
               dates,
               title,
               tableWork
            ],
         }]
      })


      Packer.toBlob(doc).then((blob) => {
         saveAs(blob, `${estimate.object} (${date}).docx`, { autoBom });
      });
   }
   if (loading) {
      return <Loader/>
   }

   const date = new Date(estimate.date).toLocaleDateString()
   return (
      <div>
         <CreateLine subs={subsections} list={listLine}/>
         <EditEstimate estimate={estimate} isOpen={isEditEstimateOpen} setIsOpen={setIsEditEstimateOpen}/>
         <DeleteEstimate/>
         <DeleteLine index={index}/>
         <EditLine index={index} el={lineInfo} subs={subsections} list={listLine}/>
         <div className="row mt-2">
            <div className="col">
               <button
                  type="button"
                  className="btn btn-outline-dark btn-lg"
                  onClick={() => history.goBack()}
               >
                  <ReactLeft/>
               </button>
            </div>
            <div className="col d-flex justify-content-end">
               <button
                  type="button"
                  className="btn btn-outline-danger me-2 btn-lg"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteEstimate"
               >
                  <ReactTrash/>
               </button>
               <button
                  type="button"
                  className="btn btn-outline-primary me-2 btn-lg"
                  onClick={() => downloadHandler()}
               >
                  <ReactDownload/>
               </button>
               <button
                  type="button"
                  className="btn btn-outline-warning me-2 btn-lg"
                  data-bs-toggle="modal"
                  data-bs-target="#editEstimate"
                  onClick={() => setIsEditEstimateOpen(true)}
               >
                  <ReactPencil/>
               </button>
               <button
                  type="button"
                  className="btn btn-outline-success btn-lg"
                  data-bs-toggle="modal"
                  data-bs-target="#createLineModal"
               >
                  <ReactPlus/>
               </button>
            </div>
         </div>
         <hr/>
         <div className="row flex-column flex-nowrap mt-3">
            <div className="col">
               <span className="fs-2" style={{borderBottom: '2px solid #000'}}>{estimate.object}</span>
            </div>
            <div className="col d-flex align-items-center">
               <div className={'fs-3 me-3'}>Заказчик:</div>
               <div className={'fs-3 data'}>{estimate.customer}</div>
            </div>
            <div className="col d-flex align-items-center">
               <div className={'fs-3 me-3'}>Тип работы:</div>
               <div className={'fs-3 data'}>{estimate.typeWork}</div>
            </div>
            <div className="col d-flex align-items-center">
               <div className={'fs-3 me-3'}>Подрядчик:</div>
               <div className={'fs-3 data'}>{estimate.contractor}</div>
            </div>
            <div className="col d-flex align-items-center">
               <div className={'fs-3 me-3'}>Бригада:</div>
               <div className={'fs-3 data'}>{estimate.brigade}</div>
            </div>
            <div className="col d-flex align-items-center">
               <div className={'fs-3 me-3'}>Дата:</div>
               <div className={'fs-3 data'}>{date}</div>
            </div>
            <div className="col d-flex align-items-center">
               <div className={'fs-3 me-3'}>Общая стоимость:</div>
               <div className={'fs-3 data'}>{`${estimate.totalPrice.toFixed(2)} РУБ`}</div>
            </div>
         </div>
         <hr/>
         {!lines.length ? <p className={'fs-3'}>Пока что нет ни одного поля</p> :
            <div className="table-responsive">
               <table className="table table-bordered border-dark align-middle">
                  <thead className={'table-dark'}>
                  <tr>
                     <th scope="col">№</th>
                     <th scope="col">Работа</th>
                     <th scope="col">Кол</th>
                     <th scope="col" style={{width: '50px'}}>Ед.изм</th>
                     <th scope="col">Стм. ₽</th>
                     <th scope="col">{estimate.totalPrice.toFixed(2)}</th>
                     <th scope="col" style={{width: '125px'}}>Действия</th>
                  </tr>
                  </thead>
                  <tbody>
                  {lines.map((el, i, arr) => {
                     if (el.section !== '' && arr[i - 1]?.section !== el.section){
                        countRef.current = 1
                        return (
                           <React.Fragment key={el._id}>
                              <tr style={{background: '#efdeb4'}}>
                                 <td colSpan={'5'}><span className={'fw-bold'}>Раздел:</span> {el.section}</td>
                                 <td colSpan={'2'}>
                                    {arr
                                    .filter(element => element.section === el.section)
                                    .reduce((acc, ce) => acc + ce.totalPrice, 0).toFixed(2)
                                 }
                                 </td>
                              </tr>
                              <tr>
                                 <th scope="row">{countRef.current}</th>
                                 <td >{el.job}</td>
                                 <td>{el.count}</td>
                                 <td>{el.unit ? el.unit : '-'}</td>
                                 <td>{el.price.toFixed(2)}</td>
                                 <td>{el.totalPrice.toFixed(2)}</td>
                                 <td>
                                    <div className="d-flex flex-nowrap">
                                       <button className="btn btn-outline-warning btn-lg me-2"
                                               data-bs-toggle="modal"
                                               data-bs-target="#editLine"
                                               onClick={() => buttonHandler(el._id, el)}
                                       ><ReactPencil/></button>
                                       <button className="btn btn-outline-danger btn-lg me-0"
                                               data-bs-toggle="modal"
                                               data-bs-target="#deleteLine"
                                               onClick={() => buttonHandler(el._id)}
                                       ><ReactTrash/></button>
                                    </div>
                                 </td>
                              </tr>
                           </React.Fragment>
                        )
                     }
                     countRef.current += 1
                     if (el.section === '' && !arr[i - 1]) {
                        countRef.current = 1
                     }
                     return (
                        <tr key={el._id}>
                           <th scope="row" >{countRef.current}</th>
                           <td >{el.job}</td>
                           <td>{el.count}</td>
                           <td>{el.unit ? el.unit : '-'}</td>
                           <td>{el.price.toFixed(2)}</td>
                           <td>{el.totalPrice.toFixed(2)}</td>
                           <td>
                              <div className={'d-flex flex-nowrap'}>
                                 <button className="btn btn-outline-warning btn-lg me-2"
                                         data-bs-toggle="modal"
                                         data-bs-target="#editLine"
                                         onClick={() => buttonHandler(el._id, el)}
                                 ><ReactPencil/></button>
                                 <button className="btn btn-outline-danger btn-lg me-0"
                                         data-bs-toggle="modal"
                                         data-bs-target="#deleteLine"
                                         onClick={() => buttonHandler(el._id)}
                                 ><ReactTrash/></button>
                              </div>
                           </td>
                        </tr>
                     )
                  })}
                  </tbody>
                  <tfoot>
                  <tr>
                     <td colSpan={'5'} className={'fw-bold text-end'}>
                        Итого по смете
                     </td>
                     <td colSpan={'2'} className={'fw-bold'}>
                        {`${estimate.totalPrice.toFixed(2)} РУБ`}
                     </td>
                  </tr>
                  <tr>
                     <td colSpan={'2'} className={'fst-italic'}>
                        Сумма прописью
                     </td>
                     <td colSpan={'5'} className={'fst-italic'}>
                        {estimate.totalPriceToString}
                     </td>
                  </tr>
                  </tfoot>
               </table>
            </div>
         }
      </div>
   )
}

export default EstimateCard