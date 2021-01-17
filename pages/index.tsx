import React from 'react';
import Link from 'next/link'; // eslint-disable-line import/no-extraneous-dependencies
import { NextPage } from 'next'; // eslint-disable-line import/no-extraneous-dependencies

const IndexPage: NextPage = () => (
  <main>
    <Link href="/img">Img page</Link>
  </main>
);

export default IndexPage;
