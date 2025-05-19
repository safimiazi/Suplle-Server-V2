import bcrypt from "bcryptjs";
const comparePassword = async (password: string, hashedPassword: string) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);

 
    return isMatch;

};
export default comparePassword;