
import { DocumentRef } from './document-ref.service';

describe('DocumentRef', () => {
  const buildService = (): DocumentRef => {
    return new DocumentRef();
  };

  describe('#getDocument', () => {
    let doc;
    beforeEach(() => {
      const documentRef = buildService();
      doc = documentRef.getDocument();
    });

    it('should return the global document object', () => {
      expect(doc).toEqual(document);
    });
  });
});
