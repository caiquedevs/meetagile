export default interface IRoute {
  icon: any;
  path: string;
  name: string;
  component: any;
  isPrivate: boolean;
  children?: IRoute[];
}
