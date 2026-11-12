// Lift the person out of a photo with macOS Vision (the same model as
// "Copy Subject" in Photos), cropped tight, as a transparent PNG.
// macOS 14+ only. Called by remove_bg.py and bin/clean-cutout.mjs:
//   osascript -l JavaScript lift-subject.js <photo> <out.png>
ObjC.import('Foundation'); ObjC.import('Vision'); ObjC.import('CoreImage'); ObjC.import('AppKit');
function run(argv){
  const inp=$.NSURL.fileURLWithPath(argv[0]), out=argv[1];
  const ci=$.CIImage.imageWithContentsOfURL(inp);
  const req=$.VNGenerateForegroundInstanceMaskRequest.alloc.init;
  const h=$.VNImageRequestHandler.alloc.initWithCIImageOptions(ci,$({}));
  const err=Ref();
  if(!h.performRequestsError($([req]),err)) return 'perform failed: '+(err[0]?ObjC.unwrap(err[0].localizedDescription):'?');
  const res=req.results; if(!res || res.count==0) return 'no subject';
  const r=res.objectAtIndex(0);
  const pb=r.generateMaskedImageOfInstancesFromRequestHandlerCroppedToInstancesExtentError(r.allInstances,h,true,err);
  if(!pb) return 'mask failed';
  const masked=$.CIImage.imageWithCVPixelBuffer(pb);
  const rep=$.NSBitmapImageRep.alloc.initWithCIImage(masked);
  const data=rep.representationUsingTypeProperties($.NSBitmapImageFileTypePNG,$({}));
  data.writeToFileAtomically(out,true);
  return 'ok '+rep.pixelsWide+'x'+rep.pixelsHigh+' instances='+r.allInstances.count;
}
