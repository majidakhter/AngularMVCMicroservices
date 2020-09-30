
export interface ISection {

  /**
   * The name of the section.
   */
  name: string;

  /**
   * The page url for this section.
   */
  pageUrl: string;

  /**
   * The sort order for this section.
   */
  sortOrder: number;

  /**
   * The submenu for this menu
   */
  subMenu: ISection[];
}
