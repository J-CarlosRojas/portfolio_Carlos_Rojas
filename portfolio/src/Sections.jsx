import React from 'react';

function Sections({ sections }) {
  return (
    <div className="sections-container">
      {sections.map((section, index) => (
        <div key={index} className="section">
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Sections;