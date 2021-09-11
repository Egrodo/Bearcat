import majorsInfo from "./majors-info.json";

export const GetSendMajorInfo =
  () => `If you would like to set your role to a major, you may use the \`/setmajor\`  with one of the following majors:\n\n${Object.entries(
    majorsInfo
  ).reduce((currStr, [shortname, longname]) => {
    currStr += `\`${shortname}\` for ${longname}\n`;
    return currStr;
  }, "")}
  `;
