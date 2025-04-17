// Components/DescreteWeekBox.js
import React, { useEffect, useState } from 'react';
import './css/DescreteWeekBox.css';

const PROMPT_STATUS = {
  hasResponse: 'hasResponse',
  waitForEntry: 'waitForEntry',
  dataMissed: 'dataMissed',
  invalidData: 'invalidData',
  promptNotAsked: 'promptNotAsked',
};

const getDayName = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });
const getMMDD = (date) => date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });

const COLORS = {
  hasResponse: '#6A9C89',
  waitForEntry: '#F9C74F',
  dataMissed: 'gray',
  invalidData: 'gray',
  promptNotAsked: 'black',
};

export default function DescreteWeekBox({ data, question }) {
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const current = new Date();
    const first = current.getDate() - current.getDay();
    const week = [...Array(7)].map((_, i) => {
      const d = new Date(current);
      d.setDate(first + i);
      return d;
    });
    setWeekDates(week);
  }, []);

  const getStatus = (date) => {
    const ts = date.toDateString();
    const records = Array.isArray(data)
      ? data
      : data?.times?.map((timestamp, index) => ({
          collectedtimestamp: timestamp,
          value: JSON.stringify([data.labels?.[index % data.labels.length] || '-1']),
          questionid: question.questionid,
        })) || [];

    const entry = records.find(
      (d) => new Date(d.collectedtimestamp).toDateString() === ts && d.questionid === question.questionid
    );

    if (!entry) return PROMPT_STATUS.dataMissed;
    if (entry.value === '-1') return PROMPT_STATUS.invalidData;
    return PROMPT_STATUS.hasResponse;
  };

  const renderValue = (status) => {
    switch (status) {
      case PROMPT_STATUS.waitForEntry:
        return 'waiting';
      case PROMPT_STATUS.dataMissed:
        return 'missing';
      case PROMPT_STATUS.invalidData:
        return 'invalid';
      case PROMPT_STATUS.promptNotAsked:
        return 'N/A';
      case PROMPT_STATUS.hasResponse:
        return '✓';
      default:
        return '?';
    }
  };

  return (
    <div className="week-box-wrapper">
      <h5>{question.longUIquestion}</h5>
  
      <div className="week-box-grid">
        {weekDates.map((date, idx) => {
          const status = getStatus(date);
          return (
            <div
              key={idx}
              className="day-box"
              style={{ backgroundColor: COLORS[status] }}
            >
              <div className="day-label">
                {getMMDD(date)} {getDayName(date)}
              </div>
              <div className="box-value">{renderValue(status)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );  
}