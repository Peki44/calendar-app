import React, { useEffect, useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, startOfWeek, endOfWeek, addDays,isSameMonth } from 'date-fns';
import './App.css';
import axios from 'axios';

const Calendar = () => {
  const [commits, setCommits] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());


  useEffect(() => {
    const fetchCommitsFromGitHub = async () => {
      try {
        const response = await axios.get(
          'https://api.github.com/repos/Peki44/FindMyDog-web-app/commits?sha=main'
        );
        setCommits(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchCommitsFromGitHub();
  }, []);

  const firstDay=startOfMonth(currentMonth);
  const lastDay=endOfMonth(currentMonth);

  const startDate = startOfWeek(firstDay);
  const endDate = endOfWeek(lastDay);

  const datesInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  

    const getWeekDaysNames = () => {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(
          <div className="dayNames">
            {format(addDays(startDate, day), "EEEE")}
          </div>
        );
      }
      return <div className="weekContainer">{weekDays}</div>;
  };

  return (
    <div className="calendar">
      <div className="header">
         <h1>{format(currentMonth, 'MMMM yyyy')}</h1>
         <div>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}><AiOutlineLeft className="navIcon"/></button>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}><AiOutlineRight className="navIcon" /></button>
         </div>
      </div>

      {getWeekDaysNames()}
    
      <div className="days">
        {datesInMonth.map((date) => (
          <DayCell key={date} date={date} commits={commits} currentMonth={currentMonth} />
        ))}
      </div>
    </div>
  );
};

const DayCell = ({ date, commits, currentMonth }) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const dailyCommits = commits.filter((commit) => commit.commit.author.date.includes(formattedDate)).map((commit) => commit.commit.message);;

  //const commitMessage = dailyCommits.length > 0 ? dailyCommits[0] : ' ';

  const isDayInCurrentMonth = isSameMonth(date, currentMonth);

  const dayCellClasses = `dayCell ${isDayInCurrentMonth ? '' : 'dayCellOutside' }`;

  const [showCommits, setShowCommits] = useState(false);

  const toggleCommits = () => {
    setShowCommits(!showCommits);
  };

  return (
    <div className={dayCellClasses}  onClick={toggleCommits}>
      <div className="date">{format(date, 'd')}</div>
      <div className="commitMessage">{dailyCommits.length > 0 && isDayInCurrentMonth  ? dailyCommits.length + " commits"  : ''} </div>
      {showCommits && (
        <div className='commits'>
          { isDayInCurrentMonth  ? dailyCommits.map((message, index) => (
          <div className='commit' key={index}>{message}</div>)) : ''}
        </div>
      )}
    </div>
  );
};

export default Calendar;