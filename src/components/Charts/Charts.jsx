import React, {useState} from 'react';
import './Charts.scss';
import Loader from '../Loader';
import Error from '../Error';
import {Calendar} from 'primereact/calendar';
import {convertNewDate, convertServerResponse, request} from '../../utils/utils';
import {Button} from 'primereact/button';
import {
  ChartPolarAreaButton,
  ChartDoughnutButton,
  ChartBarButton,
  ChartPieButton,
  ChartRadarButton
} from '../Buttons/Buttons.jsx';
import PolarArea from './PolarArea';
import PieChart from './Pie';
import DoughnutChart from './Doughnut';
import BarChart from './Bar';
import RadarChart from './Radar';

const Charts = () => {
  console.log('render Charts...');

  const today = new Date();
  const [dateBegin, setDateBegin] = useState(today);
  const [dateEnd, setDateEnd] = useState(today);
  const [chartsData, setChartsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedChart, setSelectedChart] = useState('pie');
  const [disabledChartButton, setDisabledChartButton] = useState(true);

  let minDate = new Date(2021, 2, 30);
  let maxDate = new Date();





  const fetchCharts = async () => {
    try {
      console.log('dateBegin     ++++++++++++++++++');
      console.log(dateBegin);
      console.log('dateEnd       ++++++++++++++++++++');
      console.log(dateEnd);

      setIsLoading(true);
      setErrorMessage('');

      const convertDateBegin = convertNewDate(dateBegin);
      const convertDateEnd = convertNewDate(dateEnd);

      console.log('convertDateBegin     ++++++++++++++++++');
      console.log(convertDateBegin);
      console.log('convertDateEnd       ++++++++++++++++++++');
      console.log(convertDateEnd);

      const requestDates = {
        dateBegin : convertDateBegin,
        dateEnd : convertDateEnd
      }

      // запрос к серверу
      const serverResponse = await request(
        `/api/timetracks`,
        'POST',
        {
          ...requestDates
        }
      );

      //ответ от сервера
      if (!serverResponse) {
        setErrorMessage(`Charts --> fetchCharts --> Ответ сервера пуст!`);
      }
      console.log('serverResponse -- Charts --> fetchCharts -- /api/timetracks --> ');
      console.log(serverResponse);

      //если ответ от сервера === объект с ошибкой
      if (!Array.isArray(serverResponse)) {
        setErrorMessage(serverResponse.message);
        console.log('serverResponse.message  ***********   ************   ************');
        console.log(serverResponse.message);
      } else {
        setChartsData(serverResponse);
        setDisabledChartButton(false);
      }

      setIsLoading(false);
    } catch (error) {
      setErrorMessage(`Charts --> fetchCharts --> (catch) --> ${error}`);
    }
  };

console.log('chartsData --- chartsData --- chartsData --------------------');
console.log(chartsData);
const resultSetToArray = chartsData.length === 0 ? [] : convertServerResponse(chartsData);

  //TODO :::
  //... реализовать цикл
  //... протестировать цикл
  //... переименовать массив

  //TODO :::
  //..."откусывать" от массива по два элемента : 0-й и 1-й
  //...помещать в массив [действие(0), цвет_действия(1)]
  //...и все эти массивы 1) поместить в родительский массив
  //...и все эти массивы 2) пропустить через JSON.srtingify и поместить в Set
  //...сделать из Set массив, добавить в каждый элемент счетчик : [действие(0), цвет_действия(1), счетчик(2) = 0]
  //...бежать по родительскому массиву и при совпадении (0) и (1) инкрементировать (2)


  const onChangeHandlerDateBegin = (e) => {
    setDateBegin(e.target.value);
    console.log(e.target.value);
  }

  const onChangeHandlerDateEnd = (e) => {
    setDateEnd(e.target.value);
    console.log(e.target.value);
  }

  const onChartButtonsHandler = (typeChart) => {
    return () => {
      setSelectedChart(typeChart)
    }
  }


  return (
    <section className='charts'>
      <h1 className='charts__title'>Charts</h1>
      <div className='charts__dates'>
        <div className='p-field p-col-12 p-md-4 charts__date'>
          <Calendar
            id='currentDateBegin'
            dateFormat='dd.mm.yy'
            value={dateBegin}
            onChange={onChangeHandlerDateBegin}
            minDate={minDate}
            maxDate={maxDate}
            showIcon
            readOnlyInput
          />
        </div>
        <div className='p-field p-col-12 p-md-4 charts__date'>
          <Calendar
            id='currentDateEnd'
            dateFormat='dd.mm.yy'
            value={dateEnd}
            onChange={onChangeHandlerDateEnd}
            minDate={minDate}
            maxDate={maxDate}
            showIcon
            readOnlyInput
          />
        </div>
      </div>
      <div className='charts__buttons'>
        <Button
          className='p-button-lg charts__button charts__button--get'
          label='Get timetrack'
          icon='pi pi-cloud-download'
          onClick={fetchCharts}
        />
      </div>

      <div className='charts__buttons'>
        <ChartPieButton
          selected={selectedChart === 'pie'}
          onClickHandler={onChartButtonsHandler('pie')}
          disabledChartButton={disabledChartButton}
        />

        <ChartDoughnutButton
          selected={selectedChart === 'doughnut'}
          onClickHandler={onChartButtonsHandler('doughnut')}
          disabledChartButton={disabledChartButton}
        />

        <ChartBarButton
          selected={selectedChart === 'bar'}
          onClickHandler={onChartButtonsHandler('bar')}
          disabledChartButton={disabledChartButton}
        />

        <ChartPolarAreaButton
          selected={selectedChart === 'polarArea'}
          onClickHandler={onChartButtonsHandler('polarArea')}
          disabledChartButton={disabledChartButton}
        />

        <ChartRadarButton
          selected={selectedChart === 'radar'}
          onClickHandler={onChartButtonsHandler('radar')}
          disabledChartButton={disabledChartButton}
        />

      </div>





      { isLoading && <Loader/> }
      { errorMessage && <Error message={errorMessage}/> }

      {
        !isLoading && !errorMessage &&
        <div className='card'>

          {selectedChart === 'pie' && <PieChart chartData={resultSetToArray}/>}
          {selectedChart === 'doughnut' && <DoughnutChart chartData={resultSetToArray}/>}
          {selectedChart === 'bar' && <BarChart chartData={resultSetToArray}/>}
          {selectedChart === 'polarArea' && <PolarArea chartData={resultSetToArray}/>}
          {selectedChart === 'radar' && <RadarChart chartData={resultSetToArray}/>}
        </div>
      }




    </section>
  )
}

export default Charts;

/**
 *
 *
 <PolarArea chartData={resultSetToArray}/>
 *
 * let _arr = [
    // {
    //   "id": 1,
    //   "date": "20210401",
    //   "00work": "111111",      "00color": "#ff0000",      "01work": "222222",      "01color": "#00ff00",
    //   "02work": "333333",      "02color": "#0000ff",      "03work": "444444",      "03color": "#ffff00",
    //   "04work": "111111",      "04color": "#ff0000",      "05work": "222222",      "05color": "#00ff00",
    //   "06work": "333333",      "06color": "#0000ff",      "07work": "444444",      "07color": "#ffff00",
    //   "08work": "111111",      "08color": "#ff0000",      "09work": "222222",      "09color": "#00ff00",
    //   "10work": "333333",      "10color": "#0000ff",      "11work": "444444",      "11color": "#ffff00",
    //   "12work": "111111",      "12color": "#ff0000",      "13work": "222222",      "13color": "#00ff00",
    //   "14work": "333333",      "14color": "#0000ff",      "15work": "444444",      "15color": "#ffff00",
    //   "16work": "111111",      "16color": "#ff0000",      "17work": "222222",      "17color": "#00ff00",
    //   "18work": "333333",      "18color": "#0000ff",      "19work": "444444",      "19color": "#ffff00",
    //   "20work": "111111",      "20color": "#ff0000",      "21work": "222222",      "21color": "#00ff00",
    //   "22work": "333333",      "22color": "#0000ff",      "23work": "444444",      "23color": "#ffff00"
    // },
    // {
    //   "id": 2,
    //   "date": "20210402",
    //   "00work": "555555",      "00color": "#ff00ff",      "01work": "222222",      "01color": "#00ff00",
    //   "02work": "333333",      "02color": "#0000ff",      "03work": "444444",      "03color": "#ffff00",
    //   "04work": "555555",      "04color": "#ff00ff",      "05work": "222222",      "05color": "#00ff00",
    //   "06work": "333333",      "06color": "#0000ff",      "07work": "444444",      "07color": "#ffff00",
    //   "08work": "555555",      "08color": "#ff00ff",      "09work": "222222",      "09color": "#00ff00",
    //   "10work": "333333",      "10color": "#0000ff",      "11work": "444444",      "11color": "#ffff00",
    //   "12work": "555555",      "12color": "#ff00ff",      "13work": "222222",      "13color": "#00ff00",
    //   "14work": "333333",      "14color": "#0000ff",      "15work": "444444",      "15color": "#ffff00",
    //   "16work": "555555",      "16color": "#ff00ff",      "17work": "222222",      "17color": "#00ff00",
    //   "18work": "333333",      "18color": "#0000ff",      "19work": "444444",      "19color": "#ffff00",
    //   "20work": "555555",      "20color": "#ff00ff",      "21work": "222222",      "21color": "#00ff00",
    //   "22work": "333333",      "22color": "#0000ff",      "23work": "444444",      "23color": "#ffff00"
    // },
  // {
  //   "id": 4,
  //   "date": "20210402",
  //   "00work": "game", "00color": "#fa661b", "01work": "unknow", "01color": "#000000",
  //   "02work": "cod020202", "02color": "#ff0000", "03work": "eat030303", "03color": "#00ff00",
  //   "04work": "unknow", "04color": "#000000", "05work": "unknow", "05color": "#000000",
  //   "06work": "unknow", "06color": "#000000", "07work": "unknow", "07color": "#000000",
  //   "08work": "unknow", "08color": "#000000", "09work": "unknow", "09color": "#000000",
  //   "10work": "unknow", "10color": "#000000", "11work": "unknow", "11color": "#000000",
  //   "12work": "unknow", "12color": "#000000", "13work": "unknow", "13color": "#000000",
  //   "14work": "unknow", "14color": "#000000", "15work": "unknow", "15color": "#000000",
  //   "16work": "unknow", "16color": "#000000", "17work": "unknow", "17color": "#000000",
  //   "18work": "unknow", "18color": "#000000", "19work": "unknow", "19color": "#000000",
  //   "20work": "unknow", "20color": "#000000", "21work": "unknow", "21color": "#000000",
  //   "22work": "unknow", "22color": "#000000", "23work": "unknow", "23color": "#000000"
  // },
  //   {
  //     "id": 5,
  //     "date": "20210403",
  //     "00work": "game",      "00color": "#fa661b",    "01work": "unknow",      "01color": "#000000",
  //     "02work": "cod020202",      "02color": "#ff0000",      "03work": "eat030303",      "03color": "#00ff00",
  //     "04work": "unknow",      "04color": "#000000",      "05work": "unknow",      "05color": "#000000",
  //     "06work": "unknow",      "06color": "#000000",      "07work": "unknow",      "07color": "#000000",
  //     "08work": "unknow",      "08color": "#000000",      "09work": "unknow",      "09color": "#000000",
  //     "10work": "unknow",      "10color": "#000000",      "11work": "unknow",      "11color": "#000000",
  //     "12work": "unknow",      "12color": "#000000",      "13work": "unknow",      "13color": "#000000",
  //     "14work": "unknow",      "14color": "#000000",      "15work": "unknow",      "15color": "#000000",
  //     "16work": "unknow",      "16color": "#000000",      "17work": "unknow",      "17color": "#000000",
  //     "18work": "unknow",      "18color": "#000000",      "19work": "unknow",      "19color": "#000000",
  //     "20work": "unknow",      "20color": "#000000",      "21work": "unknow",      "21color": "#000000",
  //     "22work": "unknow",      "22color": "#000000",      "23work": "unknow",      "23color": "#000000"
  //   }
  // ];

*
 * {
    "dateBegin":"20210331",
    "dateEnd":"20210402"
}
 *
 *
 *
 *[
 {
        "id": 2,
        "date": "20210331",
        "00work": "unknow",
        "00color": "#000000",
        "01work": "unknow",
        "01color": "#000000",
        "02work": "unknow",
        "02color": "#000000",
        "03work": "unknow",
        "03color": "#000000",
        "04work": "unknow",
        "04color": "#000000",
        "05work": "unknow",
        "05color": "#000000",
        "06work": "unknow",
        "06color": "#000000",
        "07work": "unknow",
        "07color": "#000000",
        "08work": "unknow",
        "08color": "#000000",
        "09work": "unknow",
        "09color": "#000000",
        "10work": "unknow",
        "10color": "#000000",
        "11work": "unknow",
        "11color": "#000000",
        "12work": "unknow",
        "12color": "#000000",
        "13work": "unknow",
        "13color": "#000000",
        "14work": "unknow",
        "14color": "#000000",
        "15work": "unknow",
        "15color": "#000000",
        "16work": "unknow",
        "16color": "#000000",
        "17work": "unknow",
        "17color": "#000000",
        "18work": "unknow",
        "18color": "#000000",
        "19work": "unknow",
        "19color": "#000000",
        "20work": "unknow",
        "20color": "#000000",
        "21work": "unknow",
        "21color": "#000000",
        "22work": "unknow",
        "22color": "#000000",
        "23work": "unknow",
        "23color": "#000000"
    },
 {
        "id": 3,
        "date": "20210401",
        "00work": "coding",
        "00color": "#ff0000",
        "01work": "eat",
        "01color": "#00ff00",
        "02work": "завтрак",
        "02color": "#0000ff",
        "03work": "coding",
        "03color": "#00cc00",
        "04work": "walk",
        "04color": "#00ccff",
        "05work": "game",
        "05color": "#fa661b",
        "06work": "walk",
        "06color": "#00ccff",
        "07work": "coding44444555",
        "07color": "#b963cf",
        "08work": "unknow",
        "08color": "#000000",
        "09work": "unknow",
        "09color": "#000000",
        "10work": "unknow",
        "10color": "#000000",
        "11work": "unknow",
        "11color": "#000000",
        "12work": "unknow",
        "12color": "#000000",
        "13work": "unknow",
        "13color": "#000000",
        "14work": "unknow",
        "14color": "#000000",
        "15work": "unknow",
        "15color": "#000000",
        "16work": "unknow",
        "16color": "#000000",
        "17work": "unknow",
        "17color": "#000000",
        "18work": "unknow",
        "18color": "#000000",
        "19work": "unknow",
        "19color": "#000000",
        "20work": "unknow",
        "20color": "#000000",
        "21work": "unknow",
        "21color": "#000000",
        "22work": "unknow",
        "22color": "#000000",
        "23work": "2021-13-04--20-31",
        "23color": "#e67ce6"
    },
 ]
 *
 *
 *
 *
 *
 *
 *





 //---------------------------------------------------------------------------------------------------
 // const chartData = {
  //   datasets: [{
  //     data: [
  //       11,
  //       16,
  //       7,
  //       3,
  //       14
  //     ],
  //     backgroundColor: [
  //       "#42A5F5",
  //       "#66BB6A",
  //       "#FFA726",
  //       "#26C6DA",
  //       "#7E57C2"
  //     ],
  //     label: 'My dataset'
  //   }],
  //   labels: [
  //     "Red",
  //     "Green",
  //     "Yellow",
  //     "Grey",
  //     "Blue"
  //   ]
  // };
 //
 // const lightOptions = {
  //   legend: {
  //     labels: {
  //       fontColor: '#495057'
  //     }
  //   },
  //   scale: {
  //     gridLines: {
  //       color: '#ebedef'
  //     }
  //   }
  // };


 //---------------------------------------------------------------------------------------------------


 * **/
