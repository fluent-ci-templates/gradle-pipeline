import { gql } from "../../deps.ts";

export const check = gql`
  query check($src: String!) {
    check(src: $src)
  }
`;

export const test = gql`
  query test($src: String!) {
    test(src: $src)
  }
`;

export const build = gql`
  query build($src: String!) {
    build(src: $src)
  }
`;
